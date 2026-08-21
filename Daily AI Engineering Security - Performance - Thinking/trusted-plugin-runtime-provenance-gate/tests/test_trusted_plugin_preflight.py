import importlib.util, hashlib, pathlib, tempfile, unittest

MODULE = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "trusted_plugin_preflight.py"
spec = importlib.util.spec_from_file_location("trusted_plugin_preflight", MODULE)
tpp = importlib.util.module_from_spec(spec); assert spec and spec.loader; spec.loader.exec_module(tpp)

class PreflightTests(unittest.TestCase):
    def test_known_good_passes(self):
        with tempfile.TemporaryDirectory() as d:
            root = pathlib.Path(d) / "plugin"; root.mkdir()
            svc = root / "service.mjs"; svc.write_text("export default 1", encoding="utf-8")
            digest = hashlib.sha256(svc.read_bytes()).hexdigest()
            cfg = {"plugin_root": str(root), "service_path": str(svc), "expected_sha256": digest,
                   "trusted_roots": [str(root)], "sandbox_trusted_roots": [str(root)],
                   "required_child_env": {"TRUST_MODE": "strict"}, "child_env": {"TRUST_MODE": "strict"}}
            self.assertEqual("pass", tpp.evaluate(cfg)["status"])

    def test_path_escape_blocks(self):
        with tempfile.TemporaryDirectory() as d:
            base = pathlib.Path(d); root = base / "plugin"; root.mkdir()
            svc = base / "outside.mjs"; svc.write_text("x", encoding="utf-8")
            result = tpp.evaluate({"plugin_root": str(root), "service_path": str(svc),
                                   "trusted_roots": [str(base)], "sandbox_trusted_roots": [str(base)]})
            self.assertEqual("block", result["status"])
            self.assertIn("path_escape", {e["code"] for e in result["errors"]})

    def test_parent_child_trust_divergence_blocks(self):
        with tempfile.TemporaryDirectory() as d:
            root = pathlib.Path(d) / "plugin"; root.mkdir(); svc = root / "service.mjs"; svc.write_text("x")
            other = pathlib.Path(d) / "other"; other.mkdir()
            result = tpp.evaluate({"plugin_root": str(root), "service_path": str(svc),
                                   "trusted_roots": [str(root)], "sandbox_trusted_roots": [str(other)]})
            self.assertEqual("block", result["status"])

if __name__ == "__main__": unittest.main()
