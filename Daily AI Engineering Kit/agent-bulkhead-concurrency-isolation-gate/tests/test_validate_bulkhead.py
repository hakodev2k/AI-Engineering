import tempfile
import unittest
from pathlib import Path
import importlib.util

MODULE_PATH = Path(__file__).resolve().parents[1] / 'scripts' / 'validate_bulkhead.py'
spec = importlib.util.spec_from_file_location('validate_bulkhead', MODULE_PATH)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


class ValidateBulkheadTests(unittest.TestCase):
    def valid_policy(self):
        return {
            'version': 1,
            'resources': {
                'default': {
                    'max_concurrency': 4,
                    'max_queue': 8,
                    'queue_timeout_ms': 1000,
                    'execution_timeout_ms': 5000,
                    'retry_limit': 1,
                    'failure_rate_open_threshold': 0.5,
                    'minimum_samples': 10,
                    'recovery_cooldown_seconds': 30,
                }
            },
            'approval_required_for': [
                'production-capacity-change',
                'disabling-isolation',
                'increasing-permission-scope',
            ],
        }

    def test_valid_policy(self):
        self.assertEqual(0, mod.validate(self.valid_policy()))

    def test_rejects_unbounded_or_invalid_concurrency(self):
        p = self.valid_policy()
        p['resources']['default']['max_concurrency'] = 0
        self.assertEqual(2, mod.validate(p))

    def test_queue_timeout_must_be_lower_than_execution_timeout(self):
        p = self.valid_policy()
        p['resources']['default']['queue_timeout_ms'] = 5000
        self.assertEqual(2, mod.validate(p))

    def test_retry_limit_is_bounded(self):
        p = self.valid_policy()
        p['resources']['default']['retry_limit'] = 99
        self.assertEqual(2, mod.validate(p))

    def test_mandatory_approval_boundaries(self):
        p = self.valid_policy()
        p['approval_required_for'] = []
        self.assertEqual(2, mod.validate(p))


if __name__ == '__main__':
    unittest.main()
