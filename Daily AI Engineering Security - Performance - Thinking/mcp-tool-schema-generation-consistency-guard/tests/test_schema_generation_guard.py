import json, subprocess, sys, tempfile, unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
GUARD=ROOT/'scripts'/'schema_generation_guard.py'
SNAP=ROOT/'scripts'/'generation_snapshot.py'

class GuardTests(unittest.TestCase):
    def run_py(self,*args):
        return subprocess.run([sys.executable,*map(str,args)],capture_output=True,text=True)

    def test_valid_catalog(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'c.json'; p.write_text(json.dumps({'tools':[{'name':'x','inputSchema':{'type':'object'},'outputSchema':{'type':'object','properties':{'generation':{'type':'string'}}}}]}))
            r=self.run_py(GUARD,'validate-catalog','--catalog',p)
            self.assertEqual(r.returncode,0,r.stdout+r.stderr)

    def test_invalid_nested_schema_fails_without_publish(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'bad.json'; p.write_text(json.dumps({'tools':[{'name':'x','inputSchema':{'type':'object'},'outputSchema':{'type':'object','properties':{'v':{'type':'not-a-json-schema-type'}}}}]}))
            r=self.run_py(GUARD,'validate-catalog','--catalog',p)
            self.assertEqual(r.returncode,2)
            self.assertIn('invalid',r.stdout)

    def test_generation_mismatch_detected(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'e.jsonl'; p.write_text('\n'.join([
                json.dumps({'event':'dispatch','request_id':'r1','generation_id':'g1','schema_hash':'a','schema_expected':True}),
                json.dumps({'event':'validate','request_id':'r1','generation_id':'g2','schema_hash':'a','validator_present':True})]))
            r=self.run_py(GUARD,'analyze','--events',p)
            self.assertEqual(r.returncode,3)
            self.assertIn('GENERATION_MISMATCH',r.stdout)

    def test_missing_validator_detected(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'e.jsonl'; p.write_text('\n'.join([
                json.dumps({'event':'dispatch','request_id':'r1','generation_id':'g1','schema_hash':'a','schema_expected':True}),
                json.dumps({'event':'validate','request_id':'r1','generation_id':'g1','schema_hash':'a','validator_present':False})]))
            r=self.run_py(GUARD,'analyze','--events',p)
            self.assertEqual(r.returncode,3); self.assertIn('MISSING_PINNED_VALIDATOR',r.stdout)

    def test_pinned_generation_passes_during_refresh(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'e.jsonl'; p.write_text('\n'.join([
                json.dumps({'event':'dispatch','request_id':'r1','generation_id':'g1','schema_hash':'old','schema_expected':True}),
                json.dumps({'event':'refresh_publish','request_id':'refresh1','generation_id':'g2'}),
                json.dumps({'event':'validate','request_id':'r1','generation_id':'g1','schema_hash':'old','validator_present':True})]))
            r=self.run_py(GUARD,'analyze','--events',p)
            self.assertEqual(r.returncode,0,r.stdout+r.stderr)

    def test_snapshot_is_atomic_file_output(self):
        with tempfile.TemporaryDirectory() as d:
            c=Path(d)/'c.json'; o=Path(d)/'generation.json'
            c.write_text(json.dumps({'tools':[{'name':'x','inputSchema':{'type':'object'},'outputSchema':{'type':'object'}}]}))
            r=self.run_py(SNAP,'--catalog',c,'--generation','g7','--out',o)
            self.assertEqual(r.returncode,0,r.stdout+r.stderr)
            self.assertEqual(json.loads(o.read_text())['generation_id'],'g7')
            self.assertFalse(Path(str(o)+'.tmp').exists())

if __name__=='__main__': unittest.main()
