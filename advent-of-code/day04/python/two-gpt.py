from collections import deque

DIRS = [(-1,-1), (-1,0), (-1,1),
        (0,-1),          (0,1),
        (1,-1),  (1,0),  (1,1)]

def total_removable(grid_str: str) -> int:
    lines = [line.strip() for line in grid_str.strip().splitlines() if line.strip()]
    R = len(lines)
    C = len(lines[0]) if R else 0

    # alive[r][c] = 是否还有纸卷(@)
    alive = [[ch == '@' for ch in row] for row in lines]

    # adj[r][c] = 周围8格中@数量（只对alive格子有意义）
    adj = [[0]*C for _ in range(R)]
    for r in range(R):
        for c in range(C):
            if not alive[r][c]:
                continue
            cnt = 0
            for dr, dc in DIRS:
                rr, cc = r + dr, c + dc
                if 0 <= rr < R and 0 <= cc < C and alive[rr][cc]:
                    cnt += 1
            adj[r][c] = cnt

    q = deque()
    in_q = [[False]*C for _ in range(R)]
    for r in range(R):
        for c in range(C):
            if alive[r][c] and adj[r][c] < 4:
                q.append((r, c))
                in_q[r][c] = True

    removed = 0
    while q:
        r, c = q.popleft()
        in_q[r][c] = False

        if not alive[r][c]:
            continue
        if adj[r][c] >= 4:
            continue

        # remove it
        alive[r][c] = False
        removed += 1

        # update neighbors
        for dr, dc in DIRS:
            rr, cc = r + dr, c + dc
            if 0 <= rr < R and 0 <= cc < C and alive[rr][cc]:
                adj[rr][cc] -= 1
                if adj[rr][cc] < 4 and not in_q[rr][cc]:
                    q.append((rr, cc))
                    in_q[rr][cc] = True

    return removed
