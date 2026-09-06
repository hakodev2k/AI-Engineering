import unittest

from scripts.verify_route import validate


class RouteVerifierTests(unittest.TestCase):
    def setUp(self):
        self.registry = {
            "run_id": "run-1",
            "workers": {
                "worker-1": {
                    "parent_task_id": "task-parent",
                    "allowed_destinations": ["task-parent"],
                    "last_sequence": 4,
                    "status": "completed",
                }
            },
        }
        self.base = {
            "run_id": "run-1",
            "parent_task_id": "task-parent",
            "worker_task_id": "worker-1",
            "destination_task_id": "task-parent",
            "event_type": "completed",
            "sequence": 5,
        }

    def test_valid_lineage_is_accepted(self):
        self.assertTrue(validate(self.registry, self.base)["accepted"])

    def test_wrong_destination_is_rejected(self):
        event = dict(self.base, destination_task_id="historical-task")
        verdict = validate(self.registry, event)
        self.assertFalse(verdict["accepted"])
        self.assertEqual(verdict["reason"], "destination_not_allowed")

    def test_unknown_worker_is_rejected(self):
        event = dict(self.base, worker_task_id="worker-404")
        self.assertEqual(validate(self.registry, event)["reason"], "unknown_worker")

    def test_stale_sequence_is_rejected(self):
        event = dict(self.base, sequence=4)
        self.assertEqual(validate(self.registry, event)["reason"], "stale_or_replayed_sequence")

    def test_terminal_mismatch_is_rejected(self):
        event = dict(self.base, event_type="failed")
        self.assertEqual(validate(self.registry, event)["reason"], "terminal_state_mismatch")


if __name__ == "__main__":
    unittest.main()
