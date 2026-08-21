import json, subprocess, sys, tempfile, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'scripts/tool_argument_gate.py'; POLICY=ROOT/'config/policy.yaml'

def run(req):
    with tempfile.NamedTemporaryFile('w',suffix='.json',delete=False,encoding='utf-8') as f:
        json.dump(req,f); path=f.name
    p=subprocess.run([sys.executable,str(SCRIPT),'--request',path,'--policy',str(POLICY),'--repo-root',str(ROOT)],capture_output=True,text=True)
    return p.returncode,json.loads(p.stdout)

class GateTests(unittest.TestCase):
    def test_safe_shell_request_passes(self):
        code,r=run({'tool':'shell','arguments':{'command':'git status --short'}})
        self.assertEqual(code,0); self.assertEqual(r['status'],'passed'); self.assertFalse(r['executed'])

    def test_forbidden_command_blocks(self):
        code,r=run({'tool':'shell','arguments':{'command':'rm -rf build'}})
        self.assertEqual(code,2); self.assertTrue(any(x['code']=='FORBIDDEN_COMMAND' for x in r['findings']))

    def test_shell_chaining_blocks(self):
        code,r=run({'tool':'shell','arguments':{'command':'git status && git log -1'}})
        self.assertEqual(code,2); self.assertTrue(any(x['code']=='SHELL_META_TOKEN' for x in r['findings']))

    def test_approval_command_requires_approval(self):
        code,r=run({'tool':'shell','arguments':{'command':'git push origin main'}})
        self.assertEqual(code,4); self.assertEqual(r['status'],'approval_required')

    def test_parent_traversal_blocks(self):
        code,r=run({'tool':'file-write','arguments':{'path':'../outside.txt','content':'x'}})
        self.assertEqual(code,2); self.assertTrue(any(x['code']=='PARENT_TRAVERSAL' for x in r['findings']))

    def test_secret_like_value_blocks(self):
        code,r=run({'tool':'http','arguments':{'header':'token=super-secret-value'}})
        self.assertEqual(code,2); self.assertTrue(any(x['code']=='POSSIBLE_SECRET' for x in r['findings']))

if __name__=='__main__': unittest.main()
