import importlib.util
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location('detector', ROOT / 'scripts' / 'detect_n_plus_one.py')
DET = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(DET)

class DetectorTests(unittest.TestCase):
    def policy(self):
        return DET.load_policy(ROOT / 'config' / 'policy.yaml')

    def test_sample_detects_repeated_parameterized_shape(self):
        text = (ROOT / 'examples' / 'ef-log-sample.txt').read_text(encoding='utf-8')
        rows = DET.parse_log(text, self.policy())
        result = DET.analyze(rows, self.policy())
        self.assertEqual(5, result['total_commands'])
        self.assertEqual('fail', result['status'])
        self.assertEqual(1, len(result['suspect_groups']))
        self.assertEqual(5, result['suspect_groups'][0]['query_count'])
        self.assertEqual(5, result['suspect_groups'][0]['distinct_parameter_sets'])

    def test_constant_repetition_without_distinct_parameters_is_not_flagged(self):
        rows = [
            {'request_id':'r','sql':'SELECT [x].[Id] FROM [X] AS [x] WHERE [x].[Id] = @p','parameters':"Parameters=[@p='1']"}
            for _ in range(8)
        ]
        result = DET.analyze(rows, self.policy())
        self.assertEqual('pass', result['status'])
        self.assertEqual([], result['suspect_groups'])

    def test_normalization_replaces_literals(self):
        p = self.policy()
        a = DET.normalize_sql("SELECT * FROM T WHERE Id = 12 AND Name = 'A'", p)
        b = DET.normalize_sql("SELECT * FROM T WHERE Id = 99 AND Name = 'B'", p)
        self.assertEqual(a, b)

if __name__ == '__main__':
    unittest.main()
