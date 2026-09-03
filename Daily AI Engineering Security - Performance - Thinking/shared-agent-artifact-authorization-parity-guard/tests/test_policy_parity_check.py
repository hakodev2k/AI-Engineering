import importlib.util
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("parity", ROOT / "scripts" / "policy_parity_check.py")
parity = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(parity)

REQUIRED = ["authenticated", "resource_scope_check", "shared_immutability_guard", "downstream_reauthorization", "audit_event"]

def path(name, **overrides):
    controls = {k: True for k in REQUIRED}
    controls.update(overrides)
    return {"name": name, "protected_resource": "shared-agent-template", "mutates": True, "controls": controls}

class Tests(unittest.TestCase):
    def test_all_paths_enforce_controls(self):
        out = parity.analyze({"required_controls": REQUIRED, "paths": [path("edit"), path("upload")]})
        self.assertEqual(out["status"], "pass")

    def test_alternate_path_missing_guard_blocks(self):
        out = parity.analyze({"required_controls": REQUIRED, "paths": [path("edit"), path("upload", shared_immutability_guard=False)]})
        self.assertEqual(out["status"], "fail")
        self.assertEqual(out["violations"][0]["control"], "shared_immutability_guard")

if __name__ == "__main__":
    unittest.main()
