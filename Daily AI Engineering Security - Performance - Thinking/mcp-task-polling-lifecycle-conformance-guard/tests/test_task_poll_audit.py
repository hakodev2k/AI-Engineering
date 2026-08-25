import json, tempfile, unittest
from pathlib import Path
from scripts.task_poll_audit import audit

class TaskPollAuditTests(unittest.TestCase):
    def trace(self, records):
        f = tempfile.NamedTemporaryFile("w", delete=False, encoding="utf-8")
        with f:
            for r in records: f.write(json.dumps(r) + "\n")
        return Path(f.name)

    def test_valid_lifecycle_passes(self):
        p = self.trace([
            {"task_id":"t1","event":"task.created","timestamp_ms":0,"poll_interval_ms":1000},
            {"task_id":"t1","event":"task.poll","timestamp_ms":1000},
            {"task_id":"t1","event":"task.poll","timestamp_ms":2000},
            {"task_id":"t1","event":"task.terminal","timestamp_ms":2100,"status":"completed"},
        ])
        self.assertTrue(audit(p, 10, 10000, 0)[0])

    def test_too_fast_poll_blocks(self):
        p = self.trace([
            {"task_id":"t1","event":"task.created","timestamp_ms":0,"poll_interval_ms":1000},
            {"task_id":"t1","event":"task.poll","timestamp_ms":1000},
            {"task_id":"t1","event":"task.poll","timestamp_ms":1500},
        ])
        ok, problems, metrics = audit(p, 10, 10000, 0)
        self.assertFalse(ok); self.assertEqual(metrics["interval_violations"], 1)

    def test_poll_after_cancel_blocks(self):
        p = self.trace([
            {"task_id":"t1","event":"task.created","timestamp_ms":0},
            {"task_id":"t1","event":"task.cancel_requested","timestamp_ms":100},
            {"task_id":"t1","event":"task.poll","timestamp_ms":200},
        ])
        self.assertFalse(audit(p, 10, 10000, 0)[0])

    def test_poll_after_terminal_blocks(self):
        p = self.trace([
            {"task_id":"t1","event":"task.created","timestamp_ms":0},
            {"task_id":"t1","event":"task.terminal","timestamp_ms":100,"status":"failed"},
            {"task_id":"t1","event":"task.poll","timestamp_ms":200},
        ])
        self.assertFalse(audit(p, 10, 10000, 0)[0])

    def test_poll_budget_blocks(self):
        p = self.trace([
            {"task_id":"t1","event":"task.created","timestamp_ms":0},
            {"task_id":"t1","event":"task.poll","timestamp_ms":100},
            {"task_id":"t1","event":"task.poll","timestamp_ms":200},
        ])
        self.assertFalse(audit(p, 1, 10000, 0)[0])

if __name__ == "__main__": unittest.main()
