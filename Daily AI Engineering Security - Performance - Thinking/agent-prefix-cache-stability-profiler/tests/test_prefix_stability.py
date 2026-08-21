#!/usr/bin/env python3
import json, subprocess, sys, tempfile, unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'scripts'/'prefix_stability.py'
POLICY=ROOT/'config'/'cache-policy.json'

class PrefixProfilerTests(unittest.TestCase):
    def run_trace(self,rows,quality='true'):
        with tempfile.TemporaryDirectory() as td:
            p=Path(td)/'trace.jsonl'; p.write_text('\n'.join(json.dumps(x) for x in rows)+'\n',encoding='utf-8')
            cp=subprocess.run([sys.executable,str(SCRIPT),str(p),'--policy',str(POLICY),'--quality-pass',quality],capture_output=True,text=True)
            return cp,json.loads(cp.stdout) if cp.stdout.strip() else None
    def test_stable_candidate_passes(self):
        common={'system':{'text':'fixed'},'tools':[{'name':'read'}]}
        rows=[
          {'task_id':'b1','variant':'baseline','prefix_sections':common,'input_tokens':2000,'cached_tokens':1200,'cache_write_tokens':0,'latency_ms':100},
          {'task_id':'b2','variant':'baseline','prefix_sections':common,'input_tokens':2000,'cached_tokens':1200,'cache_write_tokens':0,'latency_ms':105},
          {'task_id':'c1','variant':'candidate','prefix_sections':common,'input_tokens':2000,'cached_tokens':1500,'cache_write_tokens':100,'latency_ms':90},
          {'task_id':'c2','variant':'candidate','prefix_sections':common,'input_tokens':2000,'cached_tokens':1500,'cache_write_tokens':0,'latency_ms':95}]
        cp,report=self.run_trace(rows);self.assertEqual(cp.returncode,0,cp.stderr);self.assertEqual(report['status'],'pass')
    def test_prefix_churn_blocks(self):
        rows=[]
        for i in range(4):rows.append({'task_id':str(i),'variant':'candidate','prefix_sections':{'system':{'revision':i}},'input_tokens':2000,'cached_tokens':1200,'cache_write_tokens':100,'latency_ms':100})
        cp,report=self.run_trace(rows);self.assertEqual(cp.returncode,3);self.assertEqual(report['status'],'regression')
    def test_missing_quality_gate_blocks(self):
        row={'task_id':'1','variant':'candidate','prefix_sections':{'system':'fixed'},'input_tokens':2000,'cached_tokens':1500,'cache_write_tokens':0,'latency_ms':100}
        cp,_=self.run_trace([row],quality='false');self.assertEqual(cp.returncode,3)
    def test_invalid_tokens_rejected(self):
        row={'task_id':'1','variant':'candidate','prefix_sections':{},'input_tokens':10,'cached_tokens':20,'cache_write_tokens':0,'latency_ms':1}
        cp,_=self.run_trace([row]);self.assertEqual(cp.returncode,2)
if __name__=='__main__':unittest.main()
