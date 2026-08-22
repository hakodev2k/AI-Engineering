#!/usr/bin/env python3
import json, pathlib, subprocess, sys, tempfile
ROOT = pathlib.Path(__file__).resolve().parents[1]

def run(*args):
    return subprocess.run([sys.executable, *map(str,args)], capture_output=True, text=True)

def main():
    v = run(ROOT/'scripts'/'validate-assessment.py', ROOT/'examples'/'assessment.json')
    if v.returncode:
        print(v.stderr); return 1
    with tempfile.TemporaryDirectory() as td:
        p = pathlib.Path(td)
        (p/'service.cs').write_text('var x = cache.Get(key); if (x == null) { var v = repository.Load(); cache.Set(key, v, 60); }', encoding='utf-8')
        out = p/'scan.json'
        s = run(ROOT/'scripts'/'scan-cache-stampede.py', p, '--output', out)
        if s.returncode != 1:
            print('scanner did not flag fixture'); return 1
        data = json.loads(out.read_text(encoding='utf-8'))
        if data['finding_count'] < 1:
            print('expected scanner findings'); return 1
    sim = run(ROOT/'scripts'/'simulate-stampede.py', '--clients', '8', '--latency-ms', '10')
    if sim.returncode:
        print(sim.stderr or sim.stdout); return 1
    report = json.loads(sim.stdout)
    if report['with_singleflight']['backend_calls'] != 1:
        print('singleflight simulation failed'); return 1
    print('self-test passed'); return 0

if __name__ == '__main__':
    raise SystemExit(main())
