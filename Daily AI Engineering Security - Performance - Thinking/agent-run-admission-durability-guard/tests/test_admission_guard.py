import importlib.util
import pathlib
import unittest

P = pathlib.Path(__file__).parents[1] / "scripts" / "admission_guard.py"
spec = importlib.util.spec_from_file_location("admission_guard", P)
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)


def rec(**changes):
    base = {
        "run_id": "run-1",
        "idempotency_key": "idem-1",
        "admission_persisted": True,
        "acceptance_acknowledged": True,
        "execution_started": True,
        "terminal_state": None,
        "recovery_enqueued": False,
        "recovery_attempts": 0,
    }
    base.update(changes)
    return base


class AdmissionGuardTests(unittest.TestCase):
    def test_started_accepted_run_is_valid(self):
        self.assertEqual([], guard.validate([rec()]))

    def test_ack_before_persistence_is_blocked(self):
        errors = guard.validate([rec(admission_persisted=False, execution_started=False, recovery_enqueued=True)])
        self.assertTrue(any("ack_before_durable_admission" in e for e in errors))

    def test_unreconciled_accepted_run_is_blocked(self):
        errors = guard.validate([rec(execution_started=False)])
        self.assertTrue(any("accepted_run_unreconciled" in e for e in errors))

    def test_recovery_enqueued_run_is_valid(self):
        self.assertEqual([], guard.validate([rec(execution_started=False, recovery_enqueued=True, recovery_attempts=1)]))

    def test_duplicate_idempotency_key_is_blocked(self):
        records = [rec(), rec(run_id="run-2")]
        errors = guard.validate(records)
        self.assertTrue(any("duplicate_idempotency_key" in e for e in errors))

    def test_recovery_attempt_limit_is_blocked(self):
        errors = guard.validate([rec(execution_started=False, recovery_enqueued=True, recovery_attempts=3)])
        self.assertTrue(any("recovery_attempts_exceeded" in e for e in errors))

    def test_terminal_run_is_valid(self):
        self.assertEqual([], guard.validate([rec(execution_started=False, terminal_state="failed")]))


if __name__ == "__main__":
    unittest.main()
