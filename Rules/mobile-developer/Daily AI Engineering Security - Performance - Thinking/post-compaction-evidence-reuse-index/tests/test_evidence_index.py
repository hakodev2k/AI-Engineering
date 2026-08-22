import json, subprocess, sys, tempfile, unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / 'scripts' / 'evidence_index.py'

class EvidenceIndexTests(unittest.TestCase):
    def run_tool(self, *args):
        return subprocess.run([sys.executable, str(SCRIPT), *args], text=True, capture_output=True)

    def test_file_fresh_then_stale(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d); idx=root/'index.json'; f=root/'a.txt'; f.write_text('v1',encoding='utf-8')
            r=self.run_tool('add-file','--index',str(idx),'--path',str(f)); self.assertEqual(r.returncode,0,r.stderr)
            r=self.run_tool('check-file','--index',str(idx),'--path',str(f)); self.assertEqual(r.returncode,0,r.stderr); self.assertEqual(json.loads(r.stdout)['status'],'fresh-reference')
            f.write_text('v2',encoding='utf-8')
            r=self.run_tool('check-file','--index',str(idx),'--path',str(f)); self.assertEqual(r.returncode,2); self.assertEqual(json.loads(r.stdout)['status'],'stale-refresh-required')

    def test_command_requires_same_fingerprint_and_artifact_hash(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d); idx=root/'index.json'; art=root/'test.out'; art.write_text('PASS',encoding='utf-8')
            r=self.run_tool('add-command','--index',str(idx),'--command','dotnet test','--state-fingerprint','head:abc','--artifact',str(art)); self.assertEqual(r.returncode,0,r.stderr)
            r=self.run_tool('check-command','--index',str(idx),'--command','dotnet test','--state-fingerprint','head:abc'); self.assertEqual(r.returncode,0,r.stderr)
            r=self.run_tool('check-command','--index',str(idx),'--command','dotnet test','--state-fingerprint','head:def'); self.assertEqual(r.returncode,2)
            art.write_text('CHANGED',encoding='utf-8')
            r=self.run_tool('check-command','--index',str(idx),'--command','dotnet test','--state-fingerprint','head:abc'); self.assertEqual(r.returncode,2)

    def test_unknown_schema_fails_safe(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d); idx=root/'index.json'; f=root/'a.txt'; f.write_text('x',encoding='utf-8'); idx.write_text('{"schema":99,"files":{},"commands":{}}',encoding='utf-8')
            r=self.run_tool('check-file','--index',str(idx),'--path',str(f)); self.assertEqual(r.returncode,3)

if __name__ == '__main__': unittest.main()
