import json
import sys
from pathlib import Path


def main():
    if len(sys.argv) < 2:
        print('usage: collect-context.py <output-file>')
        return 2
    output = Path(sys.argv[1])
    data = {
        'status': 'initialized',
        'evidence': [],
        'notes': 'Add incident evidence sources.'
    }
    output.write_text(json.dumps(data, indent=2), encoding='utf-8')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
