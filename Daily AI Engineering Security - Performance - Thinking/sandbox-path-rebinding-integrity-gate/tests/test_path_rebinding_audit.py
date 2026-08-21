import importlib.util, pathlib, unittest
MODULE=pathlib.Path(__file__).resolve().parents[1]/"scripts"/"path_rebinding_audit.py"
spec=importlib.util.spec_from_file_location("path_rebinding_audit",MODULE)
pra=importlib.util.module_from_spec(spec); assert spec and spec.loader; spec.loader.exec_module(pra)

CFG={"destination_environment":"windows","mappings":{"/mnt/d/Work":"D:\\Work"},"approved_destination_roots":["D:\\Work"],"protected_destination_roots":["C:\\Windows"]}

class PathAuditTests(unittest.TestCase):
    def test_valid_wsl_to_windows(self):
        state={"paths":[{"kind":"cwd","logical_id":"project","store":"sqlite","value":"/mnt/d/Work/App"},{"kind":"workspace","logical_id":"project","store":"rollout","value":"/mnt/d/Work/App"}]}
        r=pra.audit(state,CFG); self.assertEqual(r["status"],"allow-stage"); self.assertFalse(r["findings"])

    def test_mixed_namespace_blocks(self):
        state={"paths":[{"kind":"cwd","store":"sqlite","value":"C:\\mnt\\d\\Work\\App"}]}
        r=pra.audit(state,CFG); self.assertEqual(r["status"],"block"); self.assertEqual(r["findings"][0]["type"],"invalid-namespace")

    def test_outside_root_blocks(self):
        cfg={**CFG,"mappings":{"/mnt/c/Windows":"C:\\Windows"}}
        state={"paths":[{"kind":"writable","store":"policy","value":"/mnt/c/Windows/System32"}]}
        r=pra.audit(state,cfg); self.assertEqual(r["status"],"block")
        self.assertTrue(any(x["type"] in {"outside-approved-root","protected-root-overlap"} for x in r["findings"]))

if __name__=="__main__": unittest.main()
