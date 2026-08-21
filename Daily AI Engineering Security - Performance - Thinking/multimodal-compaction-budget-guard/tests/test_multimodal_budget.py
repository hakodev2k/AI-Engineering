import base64
import importlib.util
import pathlib
import unittest

MODULE = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "multimodal_budget.py"
spec = importlib.util.spec_from_file_location("multimodal_budget", MODULE)
mb = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(mb)


def data_url(raw: bytes) -> str:
    return "data:image/png;base64," + base64.b64encode(raw).decode("ascii")


class BudgetTests(unittest.TestCase):
    def test_duplicate_bytes_measured(self):
        image = data_url(b"same-image")
        metrics = mb.analyze({"content": ["hello", image, image]}, 100)
        self.assertEqual(2, metrics["image_count"])
        self.assertEqual(1, metrics["unique_image_count"])
        self.assertEqual(len(b"same-image"), metrics["duplicate_image_bytes"])
        self.assertEqual(200, metrics["estimated_image_tokens"])

    def test_budget_pass(self):
        metrics = mb.analyze({"text": "short", "image": data_url(b"x")}, 10)
        status, failures, headroom = mb.decision(metrics, 1000, 900, 100, 2, 1000)
        self.assertEqual("PASS", status)
        self.assertFalse(failures)
        self.assertGreaterEqual(headroom, 100)

    def test_image_count_blocks(self):
        history = {"images": [data_url(b"a"), data_url(b"b"), data_url(b"c")]}
        metrics = mb.analyze(history, 10)
        status, failures, _ = mb.decision(metrics, 10000, 9000, 100, 2, 10000)
        self.assertEqual("BLOCK", status)
        self.assertIn("image_count", failures)

    def test_headroom_blocks(self):
        metrics = mb.analyze({"text": "x" * 4000}, 0)
        status, failures, headroom = mb.decision(metrics, 1500, 1100, 200, 10, 10000)
        self.assertEqual("BLOCK", status)
        self.assertIn("required_headroom", failures)
        self.assertLess(headroom, 200)


if __name__ == "__main__":
    unittest.main()
