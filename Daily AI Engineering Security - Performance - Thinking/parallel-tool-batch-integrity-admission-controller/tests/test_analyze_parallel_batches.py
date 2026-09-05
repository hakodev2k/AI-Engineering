import importlib.util
import pathlib
import unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "analyze_parallel_batches.py"
spec = importlib.util.spec_from_file_location("analyzer", SCRIPT)
analyzer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(analyzer)


class AnalyzerTests(unittest.TestCase):
    def test_complete_batch(self):
        s = analyzer.summarize([{"batch_id":"b","concurrency":2,"expected":["a","b"],"received":["b","a"],"latency_ms":100}])
        self.assertEqual(1.0, s[2]["completeness_rate"])
        self.assertEqual(0, s[2]["missing_results"])

    def test_missing_results_detected(self):
        s = analyzer.summarize([{"batch_id":"b","concurrency":4,"expected":["a","b","c","d"],"received":[],"latency_ms":90}])
        self.assertEqual(0.0, s[4]["completeness_rate"])
        self.assertEqual(4, s[4]["missing_results"])

    def test_unexpected_result_detected(self):
        s = analyzer.summarize([{"batch_id":"b","concurrency":1,"expected":["a"],"received":["a","x"],"latency_ms":10}])
        self.assertEqual(1, s[1]["unexpected_results"])

    def test_p95_uses_upper_rank(self):
        rows = [{"batch_id":str(i),"concurrency":1,"expected":[str(i)],"received":[str(i)],"latency_ms":v} for i, v in enumerate([1,2,3,4,100])]
        self.assertEqual(100.0, analyzer.summarize(rows)[1]["p95_latency_ms"])


if __name__ == "__main__":
    unittest.main()
