import json, subprocess, sys, tempfile, unittest
from pathlib import Path

SCRIPT=Path(__file__).parents[1]/"scripts"/"compaction_durability.py"

def write_jsonl(path, rows):
    Path(path).write_text("".join(json.dumps(r,sort_keys=True)+"\n" for r in rows),encoding="utf-8")

def run(*args):
    cp=subprocess.run([sys.executable,str(SCRIPT),*map(str,args)],capture_output=True,text=True)
    return cp.returncode,json.loads(cp.stdout)

class DurabilityTests(unittest.TestCase):
    def test_source_preserved(self):
        with tempfile.TemporaryDirectory() as d:
            s=Path(d)/"s.jsonl"; l=Path(d)/"l.json"; write_jsonl(s,[{"id":1},{"id":2}])
            self.assertEqual(run("precommit","--source",s,"--ledger",l)[0],0)
            rc,out=run("postcheck","--ledger",l,"--source",s); self.assertEqual(rc,0); self.assertEqual(out["matched"],"source")
    def test_archive_fallback(self):
        with tempfile.TemporaryDirectory() as d:
            s=Path(d)/"s.jsonl"; a=Path(d)/"a.jsonl"; l=Path(d)/"l.json"; write_jsonl(s,[{"id":1}])
            run("precommit","--source",s,"--ledger",l); a.write_bytes(s.read_bytes()); s.unlink()
            rc,out=run("postcheck","--ledger",l,"--archive",a); self.assertEqual(rc,0); self.assertEqual(out["matched"],"archive")
    def test_mutation_blocks(self):
        with tempfile.TemporaryDirectory() as d:
            s=Path(d)/"s.jsonl"; l=Path(d)/"l.json"; write_jsonl(s,[{"id":1}]); run("precommit","--source",s,"--ledger",l); write_jsonl(s,[{"id":2}])
            rc,out=run("postcheck","--ledger",l,"--source",s); self.assertEqual(rc,2); self.assertEqual(out["decision"],"block")
    def test_truncation_blocks(self):
        with tempfile.TemporaryDirectory() as d:
            s=Path(d)/"s.jsonl"; l=Path(d)/"l.json"; write_jsonl(s,[{"id":1},{"id":2}]); run("precommit","--source",s,"--ledger",l); write_jsonl(s,[{"id":1}])
            self.assertEqual(run("postcheck","--ledger",l,"--source",s)[0],2)
    def test_malformed_jsonl_errors(self):
        with tempfile.TemporaryDirectory() as d:
            s=Path(d)/"s.jsonl"; l=Path(d)/"l.json"; s.write_text("{bad}\n")
            rc,out=run("precommit","--source",s,"--ledger",l); self.assertEqual(rc,3); self.assertEqual(out["decision"],"error")

if __name__=="__main__": unittest.main()
