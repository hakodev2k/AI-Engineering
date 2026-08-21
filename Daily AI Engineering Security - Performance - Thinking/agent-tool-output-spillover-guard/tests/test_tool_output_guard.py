#!/usr/bin/env python3
from __future__ import annotations
import hashlib, json, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / 'scripts' / 'tool_output_guard.py'
POLICY = ROOT / 'config' / 'policy.json'

def run(*args: str):
    return subprocess.run([sys.executable, str(SCRIPT), *args], text=True, capture_output=True)

def main() -> int:
    with tempfile.TemporaryDirectory() as td:
        t = Path(td)
        small = t/'small.txt'; small.write_text('hello\nworld\n', encoding='utf-8')
        out = t/'small.json'
        r = run('guard','--input',str(small),'--tool-name','small','--policy',str(POLICY),'--output',str(out))
        assert r.returncode == 0, r.stderr
        e = json.loads(out.read_text())
        assert e['mode'] == 'pass-through' and not e['spilled']

        big = t/'big.txt'
        lines = [f'line {i}' for i in range(30000)]
        lines[15000] = 'FATAL synthetic failure marker'
        big.write_text('\n'.join(lines)+'\n', encoding='utf-8')
        bout = t/'big.json'; events=t/'events.jsonl'
        r = run('guard','--input',str(big),'--tool-name','build','--policy',str(POLICY),'--output',str(bout),'--events',str(events))
        assert r.returncode == 0, r.stderr
        e = json.loads(bout.read_text())
        assert e['mode'] == 'spill' and e['spilled']
        assert e['omitted_lines'] > 0
        assert any('FATAL synthetic failure marker' in x['text'] for x in e['extracted_lines'])
        artifact = Path(e['artifact']); assert artifact.exists()
        assert hashlib.sha256(artifact.read_bytes()).hexdigest() == e['sha256']

        r = run('rehydrate','--artifact',str(artifact),'--sha256',e['sha256'],'--policy',str(POLICY),'--search','synthetic failure','--context','1')
        assert r.returncode == 0, r.stderr
        rr = json.loads(r.stdout)
        assert any('FATAL synthetic failure marker' in x['text'] for x in rr['lines'])
        assert len(rr['lines']) <= 500

        r = run('rehydrate','--artifact',str(artifact),'--sha256','0'*64,'--policy',str(POLICY),'--start-line','1','--end-line','5')
        assert r.returncode == 3

        outside = t/'outside.txt'; outside.write_text('outside', encoding='utf-8')
        sha = hashlib.sha256(outside.read_bytes()).hexdigest()
        r = run('rehydrate','--artifact',str(outside),'--sha256',sha,'--policy',str(POLICY),'--start-line','1','--end-line','1')
        assert r.returncode == 3

        r = run('analyze','--events',str(events)); assert r.returncode == 0, r.stderr
        m=json.loads(r.stdout); assert m['spills'] == 1 and m['raw_bytes'] > m['visible_bytes']
    print('all tests passed')
    return 0

if __name__ == '__main__': raise SystemExit(main())
