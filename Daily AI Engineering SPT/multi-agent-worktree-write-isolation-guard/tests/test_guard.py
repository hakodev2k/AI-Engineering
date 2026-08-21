#!/usr/bin/env python3
import json, os, subprocess, sys, tempfile, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GUARD = ROOT / "scripts" / "worktree_guard.py"
VERIFY = ROOT / "scripts" / "verify_handoff.py"


def run(*args, cwd=None):
    return subprocess.run([sys.executable, *map(str, args)], cwd=cwd, text=True, capture_output=True)


def git(cwd, *args):
    p = subprocess.run(["git", *args], cwd=cwd, text=True, capture_output=True, check=True)
    return p.stdout.strip()


class GuardTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); self.base = Path(self.tmp.name)
        self.repo = self.base / "repo"; self.repo.mkdir()
        git(self.repo, "init"); git(self.repo, "config", "user.email", "test@example.com"); git(self.repo, "config", "user.name", "Test")
        (self.repo / "src").mkdir(); (self.repo / "src" / "a.txt").write_text("a\n")
        git(self.repo, "add", "."); git(self.repo, "commit", "-m", "base")
        self.base_sha = git(self.repo, "rev-parse", "HEAD")
        self.branch = git(self.repo, "branch", "--show-current")
        self.manifest = self.base / "task.json"
        self.manifest.write_text(json.dumps({
            "task_id":"t1","agent_id":"w1","repo_root":str(self.repo),"worktree":str(self.repo),
            "branch":self.branch,"base_sha":self.base_sha,"owned_paths":["src"],"required_tests":["true"],"active":True
        }))

    def tearDown(self): self.tmp.cleanup()

    def test_manifest_valid(self):
        p = run(GUARD, "manifest", "--manifest", self.manifest)
        self.assertEqual(p.returncode, 0, p.stderr)

    def test_write_inside_owned_path_allowed(self):
        p = run(GUARD, "write", "--manifest", self.manifest, "--path", "src/a.txt")
        self.assertEqual(p.returncode, 0, p.stderr)

    def test_write_outside_owned_path_blocked(self):
        p = run(GUARD, "write", "--manifest", self.manifest, "--path", "README.md")
        self.assertEqual(p.returncode, 3)

    def test_branch_drift_blocked(self):
        git(self.repo, "checkout", "-b", "other")
        p = run(GUARD, "preflight", "--manifest", self.manifest)
        self.assertEqual(p.returncode, 3)

    def test_active_ownership_overlap_blocked(self):
        active = self.base / "active"; active.mkdir()
        other = dict(json.loads(self.manifest.read_text())); other["agent_id"]="w2"; other["owned_paths"]=["src/a.txt"]
        (active / "other.json").write_text(json.dumps(other))
        p = run(GUARD, "manifest", "--manifest", self.manifest, "--active-dir", active)
        self.assertEqual(p.returncode, 3)

    def test_handoff_rejects_unowned_diff(self):
        (self.repo / "outside.txt").write_text("x\n"); git(self.repo, "add", "."); git(self.repo, "commit", "-m", "outside")
        out = self.base / "handoff.json"
        p = run(VERIFY, "build", "--manifest", self.manifest, "--output", out)
        self.assertEqual(p.returncode, 3)

    def test_independent_verifier_required(self):
        (self.repo / "src" / "a.txt").write_text("b\n"); git(self.repo, "add", "."); git(self.repo, "commit", "-m", "owned")
        out = self.base / "handoff.json"; tests = self.base / "tests.json"; tests.write_text('{"results":[{"command":"true","status":"passed"}]}')
        self.assertEqual(run(VERIFY,"build","--manifest",self.manifest,"--output",out,"--test-results",tests).returncode,0)
        p = run(VERIFY,"verify","--manifest",self.manifest,"--handoff",out,"--verifier","w1")
        self.assertEqual(p.returncode,3)


if __name__ == "__main__": unittest.main()
