import datetime
import re
from typing import Any


def parse_srt(srt_file):
    """Parses an SRT file and returns a list of subtitle objects."""

    with open(srt_file, "r", encoding="utf-8-sig") as f:
        text = f.read()

    lines = text.splitlines()
    subtitles = []
    current_subtitle: dict[str, Any] = {}

    for line in lines:
        if line.isdigit():
            # Start of a new subtitle
            current_subtitle = {"index": int(line)}
        elif re.match(r"\d{2}:\d{2}:\d{2},\d{3}", line):
            # Start or end time of the current subtitle
            start_time, end_time = re.findall(r"(\d{2}:\d{2}:\d{2},\d{3})", line)[0:2]
            # if "start_time" not in current_subtitle:
            current_subtitle["start_time"] = start_time
            # else:
            current_subtitle["end_time"] = end_time
        elif line:
            # Text of the current subtitle
            if "text" not in current_subtitle:
                current_subtitle["text"] = line
            else:
                current_subtitle["text"] += "\n" + line
        else:
            # Blank line signifies the end of the current subtitle
            if current_subtitle:
                subtitles.append(current_subtitle)
                current_subtitle = {}

    return subtitles


def adjust_subtitles(subtitles, flash_duration=0.5):
    """Adjusts subtitle timings to flash for a specified duration."""

    for subtitle in subtitles:
        # Calculate the current duration
        start_time = datetime.datetime.strptime(subtitle["start_time"], "%H:%M:%S,%f")
        end_time = datetime.datetime.strptime(subtitle["end_time"], "%H:%M:%S,%f")
        current_duration = (end_time - start_time).total_seconds()

        # Set the new end time based on the minimum of flash_duration and current_duration
        new_end_time = start_time + datetime.timedelta(
            seconds=min(flash_duration, current_duration)
        )
        # if current_duration < flash_duration:
        subtitle["end_time"] = new_end_time.strftime("%H:%M:%S,%f")


def save_srt(subtitles, output_file):
    """Saves the modified subtitles to a new SRT file."""

    with open(output_file, "w") as f:
        for subtitle in subtitles:
            f.write(f"{subtitle['index']}\n")
            f.write(f"{subtitle['start_time']} --> {subtitle['end_time']}\n")
            f.write(f"{subtitle['text']}\n\n")


# Example usage
input_file = "1882766_E5_en.srt"
output_file = "1882766_E5_en_flash.srt"
flash_duration = 0.5  # Adjust the flash duration as needed

subtitles = parse_srt(input_file)
adjust_subtitles(subtitles, flash_duration)
save_srt(subtitles, output_file)
