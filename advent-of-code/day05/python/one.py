from typing import List, Tuple

def parse_database(input_text: str) -> tuple[List[Tuple[int, int]], List[int]]:
    """
    Parse input into:
      - fresh_ranges: list of (start, end)
      - available_ids: list of ingredient IDs
    """
    lines = [line.rstrip("\n") for line in input_text.splitlines()]

    fresh_ranges: List[Tuple[int, int]] = []
    available_ids: List[int] = []

    reading_ranges = True
    for raw_line in lines:
        line = raw_line.strip()

        if line == "":
            reading_ranges = False
            continue

        if reading_ranges:
            start_str, end_str = line.split("-")
            range_start = int(start_str)
            range_end = int(end_str)
            fresh_ranges.append((range_start, range_end))
        else:
            available_ids.append(int(line))

    return fresh_ranges, available_ids


def merge_overlapping_ranges(ranges: List[Tuple[int, int]]) -> List[Tuple[int, int]]:
    """
    Merge overlapping or touching inclusive ranges.
    """
    if not ranges:
        return []

    ranges.sort(key=lambda r: (r[0], r[1]))

    merged: List[Tuple[int, int]] = []
    current_start, current_end = ranges[0]

    for next_start, next_end in ranges[1:]:
        if next_start <= current_end + 1:
            # Overlap or touch
            current_end = max(current_end, next_end)
        else:
            merged.append((current_start, current_end))
            current_start, current_end = next_start, next_end

    merged.append((current_start, current_end))
    return merged


def is_id_fresh(merged_ranges: List[Tuple[int, int]], ingredient_id: int) -> bool:
    """
    Hand-written binary search.
    Find the last range whose start <= ingredient_id.
    """
    left = 0
    right = len(merged_ranges) - 1
    candidate_index = -1

    while left <= right:
        mid = (left + right) // 2
        range_start, _ = merged_ranges[mid]

        if range_start <= ingredient_id:
            candidate_index = mid        # mid is a valid candidate
            left = mid + 1               # try to find a later one
        else:
            right = mid - 1

    if candidate_index == -1:
        return False

    range_start, range_end = merged_ranges[candidate_index]
    return range_start <= ingredient_id <= range_end


def count_fresh_available_ids(input_text: str) -> int:
    fresh_ranges, available_ids = parse_database(input_text)
    merged_ranges = merge_overlapping_ranges(fresh_ranges)

    fresh_count = 0
    for ingredient_id in available_ids:
        if is_id_fresh(merged_ranges, ingredient_id):
            fresh_count += 1

    return fresh_count


# ---- AoC-style stdin usage ----
if __name__ == "__main__":
    import sys
    input_data = sys.stdin.read()
    print(count_fresh_available_ids(input_data))
