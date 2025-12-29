# Advent of Code Solutions

Solutions for Advent of Code problems in both JavaScript and Python.

## Structure

```
├── advent-of-code/
│   ├── day01/
│   │   ├── input.txt
│   │   ├── javascript/
│   │   │   └── index.js
│   │   └── python/
│   │       └── index.py
│   ├── day02/
│   │   ├── input.txt
│   │   └── javascript/
│   │       └── index.js
│   └── ...
├── package.json
└── requirements.txt
```

## Usage

### JavaScript
```bash
cd advent-of-code/day01/javascript
node index.js
```

### Python
```bash
cd advent-of-code/day01/python
python index.py
```

## Setup

### JavaScript
```bash
npm install
```

### Python
```bash
pip install -r requirements.txt
```

## Template Files

Each day should contain:
- `input.txt` - puzzle input (shared between languages)
- `javascript/index.js` - JavaScript solution
- `python/index.py` - Python solution