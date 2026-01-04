import os

input_path = os.path.join(os.path.dirname(__file__), "..", "input.txt")

def total_removable() -> int:
    with open(input_path, "r") as file:
        input = file.readlines()

        rows = len(input)
        columns = len(input[0].strip())
        adjacent_directions = [(-1, -1), (-1, 0), (-1, 1),
                               (0, -1),          (0, 1),
                               (1, -1),  (1, 0),  (1, 1)]

        alive_roll = [[char == "@" for char in line.strip()] for line in input]
        adjacent_roll_count = [[0 for _ in range(columns)] for _ in range(rows)]

        for r in range(rows):
            for c in range(columns):
                if not alive_roll[r][c]:
                    continue
                neighbor_rolls = 0
                for dr, dc in adjacent_directions:
                    rr, cc = r + dr, c + dc
                    if 0 <= rr < rows and 0 <= cc < columns and alive_roll[rr][cc]:
                        neighbor_rolls += 1
                adjacent_roll_count[r][c] = neighbor_rolls

        candidate_queue = []
        queue_head_index = 0
        in_queue = [[False for _ in range(columns)] for _ in range(rows)]

        for r in range(rows):
            for c in range(columns):
                if alive_roll[r][c] and adjacent_roll_count[r][c] < 4:
                    candidate_queue.append((r, c))
                    in_queue[r][c] = True
        
        removed = 0
        while queue_head_index < len(candidate_queue):
            r, c = candidate_queue[queue_head_index]
            queue_head_index += 1

            if not alive_roll[r][c]:
                continue
            if adjacent_roll_count[r][c] >= 4:
                continue

            alive_roll[r][c] = False
            removed += 1

            for dr, dc in adjacent_directions:
                rr, cc = r + dr, c + dc
                if 0 <= rr < rows and 0 <= cc < columns and alive_roll[rr][cc]:
                    adjacent_roll_count[rr][cc] -= 1
                    if adjacent_roll_count[rr][cc] < 4 and not in_queue[rr][cc]:
                        candidate_queue.append((rr, cc))
                        in_queue[rr][cc] = True

        print("Total removable:", removed)
        return removed
    
total_removable()