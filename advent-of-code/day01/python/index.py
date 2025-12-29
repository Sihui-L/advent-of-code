import os

input_path = os.path.join(os.path.dirname(__file__), "..", "input.txt")

def get_position_zero_times() -> int:
    startNumber = 50
    position_zero_times = 0
    current_position = startNumber

    with open(input_path, "r") as file:
        for line in file:
            direction = line[0]
            steps = int(line[1:])
            
            if direction == "L":
                if current_position - steps <= 0:
                    current_position = 0 if  (steps - current_position) % 100 == 0 else 100 - ((steps - current_position) % 100)
                else:
                    current_position -= steps
            elif direction == "R":
                if current_position + steps >= 100:
                    current_position = (current_position + steps) % 100
                else:
                    current_position += steps
            
            if current_position == 0:
                position_zero_times += 1


    print('Position 0 reached', position_zero_times, 'times')

    return position_zero_times


get_position_zero_times()