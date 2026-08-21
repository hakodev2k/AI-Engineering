import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "scan_guard.py"
spec = importlib.util.spec_from_file_location("scan_guard", SCRIPT)
scan_guard = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(scan_guard)

POLICY = {
    "duplicate_window_seconds": 30,
    "max_equivalent_scans_per_window": 1,
    "max_scans_per_minute": 4,
    "max_concurrent_scans": 2,
    "warn_scan_elapsed_ms": 2000,
    "block_scan_elapsed_ms": 10000,
    "require_reason_for_full_repo_scan": True,
    "full_repo_scope_markers": ["workspace-root", "."],
    "denied_path_fragments": ["node_modules/.pnpm", ".git/objects"],
    "allowed_reasons": ["initial-inventory", "changed-files-refresh"]
}


def ev(second=0, **kwargs):
    item = {
        "timestamp": f"2026-08-20T10:00:{second:02d}+07:00",
        "repo": "r",
        "worktree": "/w/r",
        "scope": "src",
        "reason": "changed-files-refresh",
        "scanner": "git ls-files",
        "elapsed_ms": 100,
        "concurrent_scans": 1,
        "paths": ["src"]
    }
    item.update(kwargs)
    return item


class ScanGuardTests(unittest.TestCase):
    def test_normal_events_pass(self):
        problems, metrics = scan_guard.evaluate([ev(0), ev(40)], POLICY)
        self.assertEqual([], problems)
        self.assertEqual(0, metrics["duplicate_equivalent_events"])

    def test_duplicate_equivalent_scan_blocked(self):
        problems, metrics = scan_guard.evaluate([ev(0), ev(5)], POLICY)
        self.assertTrue(any("duplicate-equivalent" in p for p in problems))
        self.assertEqual(1, metrics["duplicate_equivalent_events"])

    def test_rate_limit_blocked(self):
        events = [ev(i, scope=f"src/{i}") for i in range(5)]
        problems, _ = scan_guard.evaluate(events, POLICY)
        self.assertTrue(any("scan rate exceeds" in p for p in problems))

    def test_concurrency_blocked(self):
        problems, _ = scan_guard.evaluate([ev(0, concurrent_scans=3)], POLICY)
        self.assertTrue(any("concurrent scans" in p for p in problems))

    def test_slow_block_threshold(self):
        problems, _ = scan_guard.evaluate([ev(0, elapsed_ms=12000)], POLICY)
        self.assertTrue(any("block threshold" in p for p in problems))

    def test_slow_warning_not_violation(self):
        problems, metrics = scan_guard.evaluate([ev(0, elapsed_ms=2500)], POLICY)
        self.assertEqual([], problems)
        self.assertEqual(1, len(metrics["warnings"]))

    def test_unapproved_full_scan_reason_blocked(self):
        problems, _ = scan_guard.evaluate([ev(0, scope="workspace-root", reason="ui-refresh")], POLICY)
        self.assertTrue(any("unapproved reason" in p for p in problems))

    def test_approved_full_scan_passes(self):
        problems, _ = scan_guard.evaluate([ev(0, scope="workspace-root", reason="initial-inventory")], POLICY)
        self.assertEqual([], problems)

    def test_denied_dependency_tree_blocked(self):
        problems, _ = scan_guard.evaluate([ev(0, paths=["node_modules/.pnpm/pkg"] )], POLICY)
        self.assertTrue(any("denied path fragment" in p for p in problems))

    def test_invalid_timestamp_reported(self):
        problems, _ = scan_guard.evaluate([ev(0, timestamp="not-a-time")], POLICY)
        self.assertTrue(any("Invalid isoformat" in p or "timestamp" in p for p in problems))


if __name__ == "__main__":
    unittest.main()
