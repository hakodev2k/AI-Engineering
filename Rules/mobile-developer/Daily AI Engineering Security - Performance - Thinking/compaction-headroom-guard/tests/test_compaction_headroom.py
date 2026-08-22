import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "compaction_headroom.py"
spec = importlib.util.spec_from_file_location("headroom", SCRIPT)
headroom = importlib.util.module_from_spec(spec)
spec.loader.exec_module(headroom)


class CompactionHeadroomTests(unittest.TestCase):
    def test_safe(self):
        r = headroom.classify(1000, 400, 50, 200, 100, 100)
        self.assertEqual(r["status"], "safe")

    def test_warn(self):
        r = headroom.classify(1000, 550, 70, 200, 100, 100)
        self.assertEqual(r["status"], "warn")

    def test_compact_now_when_growth_consumes_reserve(self):
        r = headroom.classify(1000, 650, 100, 200, 100, 50)
        self.assertEqual(r["status"], "compact-now")

    def test_block_growth_when_already_at_work_limit(self):
        r = headroom.classify(1000, 700, 1, 200, 100, 50)
        self.assertEqual(r["status"], "block-growth")

    def test_reject_reserves_larger_than_capacity(self):
        with self.assertRaises(ValueError):
            headroom.classify(100, 10, 0, 80, 30, 0)

    def test_projected_free_is_never_negative(self):
        r = headroom.classify(1000, 900, 500, 50, 50, 0)
        self.assertEqual(r["free_after_projected_growth"], 0)
        self.assertEqual(r["status"], "block-growth")


if __name__ == "__main__":
    unittest.main()
