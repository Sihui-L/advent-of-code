from typing import List, Tuple

def count_total_fresh_ids(input_text: str) -> int:
    # 1) Parse only the first section (ranges), stop at blank line
    fresh_ranges: List[Tuple[int, int]] = []
    for raw_line in input_text.splitlines():
        line = raw_line.strip()
        if line == "":
            break
        start_str, end_str = line.split("-")
        fresh_ranges.append((int(start_str), int(end_str)))

    if not fresh_ranges:
        return 0

    # 2) Sort ranges by start, then end
    fresh_ranges.sort(key=lambda r: (r[0], r[1]))

    # 3) Merge overlapping/touching ranges
    merged_ranges: List[Tuple[int, int]] = []
    current_start, current_end = fresh_ranges[0]

    for next_start, next_end in fresh_ranges[1:]:
        if next_start <= current_end + 1:
            current_end = max(current_end, next_end)
        else:
            merged_ranges.append((current_start, current_end))
            current_start, current_end = next_start, next_end

    merged_ranges.append((current_start, current_end))

    # 4) Sum inclusive lengths
    total_fresh_ids = 0
    for start, end in merged_ranges:
        total_fresh_ids += end - start + 1

    return total_fresh_ids


if __name__ == "__main__":
    import sys
    print(count_total_fresh_ids(sys.stdin.read()))
