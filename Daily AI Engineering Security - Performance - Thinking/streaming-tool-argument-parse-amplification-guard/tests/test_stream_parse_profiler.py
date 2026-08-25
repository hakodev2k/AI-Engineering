import importlib.util
import tempfile
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location("profiler", ROOT/"scripts"/"stream_parse_profiler.py")
profiler=importlib.util.module_from_spec(spec); spec.loader.exec_module(profiler)

class ProfilerTests(unittest.TestCase):
    def test_scan_amplification_detects_repeated_prefix_work(self):
        rows=[{"buffer_bytes":20*i,"delta_bytes":20,"parse_us":i} for i in range(1,101)]
        p=profiler.profile(rows)
        self.assertGreater(p["scan_amplification"], 40)

    def test_linear_size_sweep_exponent_near_one(self):
        e=profiler.scaling_exponent([(1024,100),(2048,200),(4096,400),(8192,800)])
        self.assertAlmostEqual(e,1.0,places=6)

    def test_quadratic_size_sweep_exponent_near_two(self):
        e=profiler.scaling_exponent([(1024,100),(2048,400),(4096,1600),(8192,6400)])
        self.assertAlmostEqual(e,2.0,places=6)

    def test_trace_validation_rejects_decreasing_buffer(self):
        with tempfile.TemporaryDirectory() as td:
            p=Path(td)/"bad.jsonl"
            p.write_text('{"buffer_bytes":20,"delta_bytes":20,"parse_us":1}\n{"buffer_bytes":10,"delta_bytes":1,"parse_us":1}\n')
            with self.assertRaises(ValueError):
                profiler.load_trace(p)

if __name__=="__main__":
    unittest.main()
