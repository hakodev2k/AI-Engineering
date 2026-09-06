#!/usr/bin/env python3
import json
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "gate.py"


class GateTests(unittest.TestCase):
    def run_gate(self, cwd: Path, *args: str):
        return subprocess.run(["python", str(SCRIPT), *args], cwd=str(cwd), text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    def init_repo(self, root: Path):
        subprocess.run(["git", "init", "-q"], cwd=root, check=True)
        subprocess.run(["git", "config", "user.email", "test@example.com"], cwd=root, check=True)
        subprocess.run(["git", "config", "user.name", "Test"], cwd=root, check=True)

    def test_snapshot_fingerprints_spec_and_generated_files(self):
        with tempfile.TemporaryDirectory() as td:
            repo = Path(td)
            self.init_repo(repo)
            (repo / "openapi.json").write_text('{"openapi":"3.0.0"}\n', encoding="utf-8")
            (repo / "generated").mkdir()
            (repo / "generated" / "client.py").write_text("class Client: pass\n", encoding="utf-8")
            cfg = {"spec_paths":["openapi.json"],"generated_roots":["generated"],"generator_commands":[],"ignore_globs":[]}
            (repo / "config.json").write_text(json.dumps(cfg), encoding="utf-8")
            subprocess.run(["git", "add", "."], cwd=repo, check=True)
            subprocess.run(["git", "commit", "-qm", "init"], cwd=repo, check=True)
            out = repo / "out.json"
            p = self.run_gate(repo, "snapshot", "--config", str(repo / "config.json"), "--out", str(out))
            self.assertEqual(p.returncode, 0, p.stderr)
            data = json.loads(out.read_text())
            self.assertEqual(data["status"], "snapshotted")
            self.assertIn("openapi.json", data["spec"]["files"])
            self.assertIn("generated/client.py", data["generated"]["files"])

    def test_verify_pair_detects_generated_drift(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            a = {"revision":"abc","spec":{"digest":"s"},"generated":{"digest":"g1"}}
            b = {"revision":"abc","spec":{"digest":"s"},"generated":{"digest":"g2"}}
            (root / "a.json").write_text(json.dumps(a))
            (root / "b.json").write_text(json.dumps(b))
            out = root / "result.json"
            p = self.run_gate(root, "verify-pair", "--before", str(root / "a.json"), "--after", str(root / "b.json"), "--out", str(out))
            self.assertEqual(p.returncode, 2)
            self.assertEqual(json.loads(out.read_text())["status"], "failed")

    def test_regenerate_blocks_without_commands(self):
        with tempfile.TemporaryDirectory() as td:
            repo = Path(td)
            self.init_repo(repo)
            (repo / "openapi.json").write_text('{}\n')
            (repo / "generated").mkdir()
            cfg = {"spec_paths":["openapi.json"],"generated_roots":["generated"],"generator_commands":[],"ignore_globs":[],"require_clean_worktree_before_regeneration":False}
            (repo / "config.json").write_text(json.dumps(cfg))
            out = repo / "result.json"
            p = self.run_gate(repo, "regenerate", "--config", str(repo / "config.json"), "--out", str(out))
            self.assertEqual(p.returncode, 2)
            self.assertEqual(json.loads(out.read_text())["reason"], "generator-commands-not-configured")


if __name__ == "__main__":
    unittest.main()
