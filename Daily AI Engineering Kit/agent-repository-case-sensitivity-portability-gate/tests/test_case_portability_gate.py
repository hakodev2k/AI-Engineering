from __future__ import annotations

import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("case_gate", ROOT / "scripts/case_portability_gate.py")
assert SPEC and SPEC.loader
GATE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(GATE)
POLICY = GATE.load_policy(ROOT / "config/policy.json")


class CasePortabilityTests(unittest.TestCase):
    def test_path_collision_detected(self):
        findings = GATE.path_collisions(["src/Widget.ts", "src/widget.ts"])
        self.assertEqual(1, len(findings))
        self.assertEqual("path-case-collision", findings[0]["kind"])

    def test_directory_collision_detected(self):
        findings = GATE.prefix_collisions(["src/UI/Button.ts", "src/ui/Input.ts"])
        self.assertTrue(any(item["kind"] == "directory-case-collision" for item in findings))

    def test_relative_import_case_mismatch_detected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "src").mkdir()
            (root / "src" / "Widget.ts").write_text("export const x = 1;\n", encoding="utf-8")
            (root / "src" / "app.ts").write_text("import { x } from './widget';\n", encoding="utf-8")
            paths = ["src/Widget.ts", "src/app.ts"]
            findings = GATE.scan_imports(root, paths, POLICY)
            mismatches = [item for item in findings if item["kind"] == "relative-import-case-mismatch"]
            self.assertEqual(1, len(mismatches))
            self.assertEqual("./widget", mismatches[0]["reference"])

    def test_exact_relative_import_passes(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "src").mkdir()
            (root / "src" / "Widget.ts").write_text("export const x = 1;\n", encoding="utf-8")
            (root / "src" / "app.ts").write_text("import { x } from './Widget';\n", encoding="utf-8")
            findings = GATE.scan_imports(root, ["src/Widget.ts", "src/app.ts"], POLICY)
            self.assertFalse(any(item["severity"] == "error" for item in findings))

    def test_unresolved_import_is_warning_by_default(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "app.ts").write_text("import x from './generated';\n", encoding="utf-8")
            findings = GATE.scan_imports(root, ["app.ts"], POLICY)
            self.assertEqual("warning", findings[0]["severity"])

    def test_example_report_is_valid_json_shape(self):
        report = json.loads((ROOT / "examples/expected-report.json").read_text(encoding="utf-8"))
        self.assertEqual("fail", report["status"])
        self.assertEqual(1, report["blocking_findings"])


if __name__ == "__main__":
    unittest.main()
