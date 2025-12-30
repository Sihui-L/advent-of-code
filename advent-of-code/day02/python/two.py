import os

input_path = os.path.join(os.path.dirname(__file__), "..", "input.txt")

def add_all_repeat_numbers_in_range() -> int:
    repeat_numbers_in_range = []

    with open(input_path, "r") as file:
        ranges = file.readline().split(",")
        for inputRange in ranges:
            start, end = inputRange.strip().split("-")
            for num in range(int(start), int(end) + 1):
                num_str = str(num)
                length_of_num = len(num_str)

                for part_size in range(1, length_of_num // 2 + 1):
                    if length_of_num % part_size == 0:
                        parts = [num_str[i:i + part_size] for i in range(0, length_of_num, part_size)]
                        if all(part == parts[0] for part in parts):
                            repeat_numbers_in_range.append(num)
                            break
            
    sum_repeat_numbers = sum(repeat_numbers_in_range)
    print("Sum of all repeat numbers in range:", sum_repeat_numbers)
    return sum_repeat_numbers

add_all_repeat_numbers_in_range()