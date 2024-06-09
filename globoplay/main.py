import re
import os


def join_webvtt_lines(input_file, output_file):
    with open(input_file, "r", encoding="utf-8") as f_in, open(
        output_file, "w", encoding="utf-8"
    ) as f_out:
        current_cue = ""
        for line in f_in:
            # Check if the line is a timestamp
            if re.match(r"\d{2}:\d{2}:\d{2}.\d{3} --> \d{2}:\d{2}:\d{2}.\d{3}", line):
                if current_cue:
                    f_out.write(current_cue + "\n\n")  # Write newline twice
                current_cue = line
            else:
                # Append the line to the current cue
                current_cue += " " + line.strip()

        # Write the last cue
        if current_cue:
            f_out.write(current_cue + "\n")  # Write newline once for last cue


if __name__ == "__main__":
    import argparse

    # Get input arguments
    parser = argparse.ArgumentParser(description="Join WebVTT lines")
    parser.add_argument("input_file", help="Path to the input WebVTT file")
    args = parser.parse_args()

    # Extract filename and extension from input path
    filename, ext = os.path.splitext(args.input_file)

    # Generate output filename with "_joined" suffix and same extension
    output_file = filename + "_joined" + ext

    join_webvtt_lines(args.input_file, output_file)
    print(f"WebVTT lines joined. Output file: {output_file}")
