import json
import sys
from pathlib import Path


def main():
    if len(sys.argv) < 2:
        print('usage: collect-context.py <output-file>')
        return 2
    output = Path(sys.argv[1])
    output.parent.mkdir(parents=True, exist_ok=True)
    data = {
        'status': 'initialized',
        'evidence': [],
        'notes': 'Populate only with sanitized, source-attributed incident evidence.'
    }
    output.write_text(json.dumps(data, indent=2), encoding='utf-8')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
