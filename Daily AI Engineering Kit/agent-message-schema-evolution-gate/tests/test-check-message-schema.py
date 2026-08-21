#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

root = Path(__file__).resolve().parents[1]
checker = root / 'scripts' / 'check-message-schema.py'
v1 = root / 'examples' / 'order-created-v1.schema.json'
v2 = root / 'examples' / 'order-created-v2.schema.json'

with tempfile.TemporaryDirectory() as td:
    report = Path(td) / 'report.json'
    p = subprocess.run([sys.executable, str(checker), '--old', str(v1), '--new', str(v2), '--message', 'OrderCreated', '--producer', 'orders-api', '--consumer', 'billing-worker', '--output', str(report)], text=True, capture_output=True)
    if p.returncode != 0:
        raise SystemExit(f'expected additive example to be non-breaking; rc={p.returncode}\n{p.stdout}\n{p.stderr}')
    data = json.loads(report.read_text())
    assert data['status'] == 'compatible'
    assert any(f['change'] == 'add-optional-field' for f in data['findings'])
    assert any(f['change'] == 'add-enum-value' and f['severity'] == 'warning' for f in data['findings'])

    breaking = json.loads(v2.read_text())
    breaking['properties'].pop('orderId')
    broken_path = Path(td) / 'broken.schema.json'
    broken_path.write_text(json.dumps(breaking), encoding='utf-8')
    p2 = subprocess.run([sys.executable, str(checker), '--old', str(v1), '--new', str(broken_path), '--message', 'OrderCreated', '--producer', 'orders-api', '--consumer', 'billing-worker', '--output', str(report)], text=True, capture_output=True)
    if p2.returncode != 1:
        raise SystemExit(f'expected removed field to fail compatibility; rc={p2.returncode}\n{p2.stdout}\n{p2.stderr}')
    data2 = json.loads(report.read_text())
    assert data2['status'] == 'incompatible'
    assert any(f['change'] == 'remove-field' and f['path'] == '$.orderId' for f in data2['findings'])

print('PASS: compatibility checker fixture tests')
