import importlib.util
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location('wait_broker', ROOT/'scripts'/'wait_broker.py')
WB = importlib.util.module_from_spec(SPEC); SPEC.loader.exec_module(WB)

class WaitBrokerTests(unittest.TestCase):
    def test_policy_defaults_are_bounded(self):
        import json
        p=json.loads((ROOT/'config'/'policy.json').read_text())
        self.assertGreater(p['initial_interval_seconds'],0)
        self.assertGreaterEqual(p['max_interval_seconds'],p['initial_interval_seconds'])
        self.assertGreater(p['max_wait_seconds'],0)
        self.assertGreater(p['max_polls'],0)
        self.assertLess(p['jitter_ratio'],1)

    def test_terminal_and_pending_sets_do_not_overlap(self):
        import json
        p=json.loads((ROOT/'config'/'policy.json').read_text())
        self.assertTrue(set(p['terminal_states']).isdisjoint(p['pending_states']))

if __name__ == '__main__': unittest.main()
