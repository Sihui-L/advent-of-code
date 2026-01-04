import os

input_path = os.path.join(os.path.dirname(__file__), "..", "input.txt")

def count_accessible() -> int:
    with open(input_path, "r") as file:
        input = file.readlines()

        rows = len(input)
        cols = len(input[0].strip())
        adjacent_directions = [(-1, -1), (-1, 0), (-1, 1),
                               (0, -1),          (0, 1),
                               (1, -1),  (1, 0),  (1, 1)]

        ans = 0
        for r in range(rows):
            for c in range(cols):
                if input[r].strip()[c] != "@":
                    continue
                adj = 0
                for dr, dc in adjacent_directions:
                    rr, cc = r + dr, c + dc
                    if 0 <= rr < rows and 0 <= cc < cols and input[rr].strip()[cc] == "@":
                        adj += 1
                if adj < 4:
                    ans += 1
        
        print(ans)
        return ans
    
count_accessible()