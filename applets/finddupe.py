#!/usr/bin/env python3
import os
import hashlib
import sys
from collections import defaultdict

# The size of the chunk to read from files when hashing.
# Reading in chunks keeps memory usage low for large files.
CHUNK_SIZE = 65536  # 64KB

def find_duplicate_files(root_folder: str = '.') -> list[list[str]]:
    """
    Walks a directory tree, finds duplicate files, and returns them.

    The search is optimized to first group files by size, then hash only
    those groups with potential duplicates.

    Args:
        root_folder: The starting directory to search from. Defaults to CWD.

    Returns:
        A list of groups of duplicate files, ordered by size from largest to smallest.
        e.g., [['/path/a.txt', '/path/b.txt'], ['/path/c.jpg', '/path/d.jpg']]
    """
    print(f"🔍 Starting scan in '{os.path.abspath(root_folder)}'...")

    # 1. First pass: Group files by size.
    # {size_in_bytes: [path1, path2, ...]}
    files_by_size = defaultdict(list)
    file_count = 0
    for dirpath, _, filenames in os.walk(root_folder):
        for filename in filenames:
            path = os.path.join(dirpath, filename)
            # Avoid scanning symbolic links to prevent cycles and redundant work.
            if not os.path.islink(path):
                try:
                    file_count += 1
                    size = os.path.getsize(path)
                    # Ignore empty files as they are often not meaningful duplicates.
                    if size > 0:
                        files_by_size[size].append(path)
                except OSError as e:
                    print(f"⚠️  Could not access {path}: {e}")

    # This list will hold the final groups of confirmed duplicate file paths.
    all_duplicates = []

    # 2. Second pass: For files of same size, check their hash.
    # We iterate from largest to smallest files for more impactful results first.
    sorted_sizes = sorted(files_by_size.keys(), reverse=True)
    
    print(f"Found {file_count} non-empty files; now comparing by content hash...")
    for size in sorted_sizes:
        potential_duplicates = files_by_size[size]
        if len(potential_duplicates) < 2:
            continue  # This size has no duplicates, skip.

        # {hash: [path1, path2, ...]}
        hashes = defaultdict(list)
        for path in potential_duplicates:
            try:
                # Use a memory-efficient hashing function
                hasher = hashlib.sha256()
                with open(path, 'rb') as f:
                    while chunk := f.read(CHUNK_SIZE):
                        hasher.update(chunk)
                file_hash = hasher.hexdigest()
                hashes[file_hash].append(path)
            except OSError as e:
                print(f"⚠️  Could not read {path}: {e}")

        # Add any confirmed duplicates (groups with more than one file) to our final list.
        for file_list in hashes.values():
            if len(file_list) > 1:
                all_duplicates.append(file_list)

    return all_duplicates

def format_size(size_bytes: int) -> str:
    """Converts bytes into a human-readable string (KB, MB, GB)."""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024**2:
        return f"{size_bytes / 1024:.2f} KB"
    elif size_bytes < 1024**3:
        return f"{size_bytes / 1024**2:.2f} MB"
    else:
        return f"{size_bytes / 1024**3:.2f} GB"

if __name__ == "__main__":
    # Determine the root folder from command-line arguments or use the current directory.
    if len(sys.argv) > 1:
        root_path = sys.argv[1]
    else:
        root_path = '.'

    if not os.path.isdir(root_path):
        print(f"❌ Error: Directory not found at '{root_path}'")
        sys.exit(1)

    duplicates = find_duplicate_files(root_path)

    if not duplicates:
        print("\n✅ No duplicate files found.")
    else:
        print(f"\n✅ Found {len(duplicates)} sets of duplicate files:\n")
        total_wasted_space = 0
        for group in duplicates:
            # All files in a group have the same size, so we can get it from the first one.
            file_size = os.path.getsize(group[0])
            wasted_space_for_group = file_size * (len(group) - 1)
            total_wasted_space += wasted_space_for_group

            print(f"--- Size: {format_size(file_size)} ---")
            for path in group:
                print(f"  - {path}")
            print() # Newline for readability

        print("--- Summary ---")
        print(f"Total potential wasted space: {format_size(total_wasted_space)}")