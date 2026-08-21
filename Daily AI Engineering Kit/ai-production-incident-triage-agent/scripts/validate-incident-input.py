#!/usr/bin/env python3
import json
import sys

if len(sys.argv) != 2:
    print('usage: validate-incident-input.py <file>')
    sys.exit(2)

with open(sys.argv[1], 'r', encoding='utf-8') as f:
    data = json.load(f)

required = ['summary', 'timestamp']
missing = [x for x in required if x not in data]
if missing:
    print('missing:' + ','.join(missing))
    sys.exit(1)

print('valid')
