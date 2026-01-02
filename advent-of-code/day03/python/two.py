import os

input_path = os.path.join(os.path.dirname(__file__), "..", "input.txt")

def find_and_add_twelve_largest_digits() -> int:
    largest_twelve_digits = []

    with open(input_path, "r") as file:
        input = file.readlines()

        for line in input:
            digits = [int(char) for char in line.strip()]
            largest_digits = [0] * 12
            index_of_largest_digits = [0] * 12

            for i in range(12):
                index_of_previous_largest = -1 if i == 0 else index_of_largest_digits[i - 1]
                start = index_of_previous_largest + 1
                end = len(digits) - (11 - i)
                for j in range(start, end):
                    if digits[j] > largest_digits[i]:
                        largest_digits[i] = digits[j]
                        index_of_largest_digits[i] = j

            print("Largest twelve digits in line:", largest_digits)
            largest_twelve_digits.extend([int(''.join(map(str, largest_digits)))])

    print("All largest twelve digits from all lines:", largest_twelve_digits)
    sum_largest_twelve_digits = sum(largest_twelve_digits)

    print("Sum of all largest twelve digits:", sum_largest_twelve_digits)
    return sum_largest_twelve_digits

find_and_add_twelve_largest_digits()