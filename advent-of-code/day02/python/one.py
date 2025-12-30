import os

input_path = os.path.join(os.path.dirname(__file__), "..", "input.txt")

def add_all_repeat_numbers_in_range() -> int:
    repeat_numbers_in_range = []
    valid_range = []

    with open(input_path, "r") as file:
        ranges = file.readline().split(",")
        for inputRange in ranges:
            start, end = inputRange.strip().split("-")
            if len(start) % 2 == 1 or len(end) % 2 == 1:
                if len(start) != len(end):
                    if len(start) % 2 == 1:
                        start = "1" + "0" * len(start)
                        valid_range.append((int(start), int(end)))
                    else:
                        end = "9" * (len(end) - 1)
                        valid_range.append((int(start), int(end)))
            else:
                valid_range.append((int(start), int(end)))

    for start, end in valid_range:
        for number in range(start, end + 1):
            len_num = len(str(number))
            first_half = str(number)[: len_num // 2]
            second_half = str(number)[len_num // 2 :]
            if first_half == second_half:
                repeat_numbers_in_range.append(number)


    sum_repeat_numbers = sum(repeat_numbers_in_range)
    print("Sum of all repeat numbers in range:", sum_repeat_numbers)
    return sum_repeat_numbers

add_all_repeat_numbers_in_range()