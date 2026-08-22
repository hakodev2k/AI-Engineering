import importlib.util
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location('hotspot', ROOT / 'scripts' / 'analyze_partition_hotspots.py')
MOD = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MOD)

class HotspotTests(unittest.TestCase):
    def test_detects_dominant_partition(self):
        rows = [('a', 10.0)] * 8 + [('b', 1.0)] * 2
        policy = {
            'minimum_sample_count': 10,
            'hot_partition_share_threshold': 0.5,
            'hot_partition_ru_threshold': 0.5,
        }
        result = MOD.analyze(rows, policy)
        self.assertEqual('block', result['status'])
        self.assertEqual(1, result['hot_partition_count'])
        self.assertTrue(next(x for x in result['findings'] if x['partition_key'] == 'a')['hot'])

    def test_insufficient_sample_warns(self):
        rows = [('a', 1.0), ('b', 1.0)]
        policy = {'minimum_sample_count': 100}
        result = MOD.analyze(rows, policy)
        self.assertEqual('warn', result['status'])
        self.assertEqual('insufficient-sample', result['verification_status'])

    def test_balanced_sample_passes(self):
        rows = []
        for i in range(10):
            rows.extend([(f'k{i}', 1.0)] * 10)
        policy = {
            'minimum_sample_count': 100,
            'hot_partition_share_threshold': 0.2,
            'hot_partition_ru_threshold': 0.3,
        }
        result = MOD.analyze(rows, policy)
        self.assertEqual('pass', result['status'])
        self.assertEqual(0, result['hot_partition_count'])

if __name__ == '__main__':
    unittest.main()
