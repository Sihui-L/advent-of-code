import os

input_path = os.path.join(os.path.dirname(__file__), "..", "input.txt")

def find_and_add_two_largest_digits() -> int:
    largest_two_digits = []

    with open(input_path, "r") as file:
        input = file.readlines()

        for line in input:
            digits = [int(digit) for digit in line.strip()]
            largest = 0
            second_largest = 0

            # Find the largest digit before the last digit
            for digit in digits[:-1]:
                if digit > largest:
                    largest = digit

            # Find the second largest digit after the largest digit
            for digit in digits[digits.index(largest) + 1:]:
                if digit > second_largest:
                    second_largest = digit

            largest_two_digits.append(int(f"{largest}{second_largest}"))
    
    sum_largest_two_digits = sum(largest_two_digits)
    print("Sum of two largest digits per line:", sum_largest_two_digits)
    return sum_largest_two_digits

find_and_add_two_largest_digits()