import importlib.util
import pathlib
import unittest

MODULE = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "runtime_reaper.py"
spec = importlib.util.spec_from_file_location("runtime_reaper", MODULE)
rr = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(rr)


class RuntimeReaperTests(unittest.TestCase):
    def entry(self, **overrides):
        value = {
            "owner": "task-1",
            "runtime_key": "mcp:mail:v1",
            "pid": 100,
            "start_time": "2026-08-20T01:00:00Z",
            "shared": False,
            "owner_terminal": True,
        }
        value.update(overrides)
        return value

    def test_terminal_owned_survivor_blocks_and_is_planned(self):
        reg = [self.entry()]
        procs = rr.index_processes([{"pid": 100, "start_time": "2026-08-20T01:00:00Z"}])
        result = rr.reconcile(reg, procs, "task-1")
        self.assertTrue(result["blocked"])
        self.assertEqual(1, result["terminal_owner_survivors"])
        self.assertEqual(100, result["cleanup_plan"][0]["pid"])

    def test_pid_reuse_is_never_cleanup_candidate(self):
        reg = [self.entry()]
        procs = rr.index_processes([{"pid": 100, "start_time": "2026-08-20T02:00:00Z"}])
        result = rr.reconcile(reg, procs, "task-1")
        self.assertTrue(result["blocked"])
        self.assertEqual(1, result["identity_mismatches"])
        self.assertEqual([], result["cleanup_plan"])

    def test_missing_process_is_already_clean(self):
        result = rr.reconcile([self.entry()], {}, "task-1")
        self.assertFalse(result["blocked"])
        self.assertEqual(0, result["terminal_owner_survivors"])

    def test_shared_terminal_runtime_is_not_cleanup_candidate(self):
        reg = [self.entry(shared=True)]
        procs = rr.index_processes([{"pid": 100, "start_time": "2026-08-20T01:00:00Z"}])
        result = rr.reconcile(reg, procs, "task-1")
        self.assertFalse(result["blocked"])
        self.assertEqual([], result["cleanup_plan"])

    def test_duplicate_runtime_key_is_observable(self):
        reg = [self.entry(owner_terminal=False), self.entry(pid=101, start_time="s2", owner_terminal=False)]
        procs = rr.index_processes([
            {"pid": 100, "start_time": "2026-08-20T01:00:00Z"},
            {"pid": 101, "start_time": "s2"},
        ])
        result = rr.reconcile(reg, procs, None)
        self.assertEqual({"mcp:mail:v1": 2}, result["duplicate_runtime_keys"])

    def test_registry_validation_rejects_incomplete_identity(self):
        with self.assertRaises(ValueError):
            rr.validate_registry([{"pid": 1}])


if __name__ == "__main__":
    unittest.main()
