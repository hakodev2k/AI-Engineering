#!/usr/bin/env python3
import json, subprocess, sys, tempfile, unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'scripts'/'stream_arg_guard.py'
POLICY=ROOT/'config'/'policy.json'

class GuardTests(unittest.TestCase):
    def run_events(self, events):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'events.jsonl'
            p.write_text('\n'.join(json.dumps(x) for x in events),encoding='utf-8')
            return subprocess.run([sys.executable,str(SCRIPT),'validate',str(p),'--policy',str(POLICY)],capture_output=True,text=True)

    def test_delta_final(self):
        r=self.run_events([{'type':'delta','data':'{"a":'},{'type':'delta','data':'1}'},{'type':'final','data':'{"a":1}'}])
        self.assertEqual(r.returncode,0,r.stderr+r.stdout)
        self.assertEqual(json.loads(r.stdout)['arguments'],{'a':1})

    def test_snapshot_replaces_not_concatenates(self):
        r=self.run_events([{'type':'snapshot','data':'{"a":'},{'type':'snapshot','data':'{"a":2}'},{'type':'final','data':'{"a":2}'}])
        self.assertEqual(r.returncode,0)
        self.assertEqual(json.loads(r.stdout)['arguments'],{'a':2})

    def test_final_is_authoritative(self):
        r=self.run_events([{'type':'delta','data':'{"a":1}'},{'type':'final','data':'{"a":3}'}])
        self.assertEqual(r.returncode,0)
        self.assertEqual(json.loads(r.stdout)['arguments'],{'a':3})

    def test_missing_final_blocks(self):
        r=self.run_events([{'type':'delta','data':'{"a":1}'}])
        self.assertEqual(r.returncode,3)

    def test_invalid_final_blocks(self):
        r=self.run_events([{'type':'delta','data':'{"a":1}'},{'type':'final','data':'{"a":'}])
        self.assertEqual(r.returncode,5)

    def test_benchmark_runs(self):
        r=subprocess.run([sys.executable,str(SCRIPT),'benchmark','--size','4096','--chunk','32','--repeats','1'],capture_output=True,text=True)
        self.assertEqual(r.returncode,0,r.stderr)
        out=json.loads(r.stdout)
        self.assertGreater(out['naive_full_prefix_parse_attempts'],1)
        self.assertEqual(out['guarded_final_parse_attempts'],1)

if __name__=='__main__': unittest.main()
