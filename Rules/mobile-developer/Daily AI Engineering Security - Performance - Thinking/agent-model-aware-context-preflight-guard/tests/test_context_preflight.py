import argparse
import importlib.util
import json
import pathlib
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("context_preflight", ROOT / "scripts" / "context_preflight.py")
module = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
SPEC.loader.exec_module(module)


class ContextPreflightTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.dir = pathlib.Path(self.tmp.name)
        self.policy = self.dir / "policy.json"
        self.policy.write_text(json.dumps({
            "default_safety_margin_ratio": 0.08,
            "minimum_safety_margin_tokens": 100,
            "reserve_output_tokens": 500,
            "reserve_reasoning_tokens": 0,
            "exact_counter_required_above_utilization": 0.80,
            "fallback": {
                "enabled": True,
                "max_utilization": 0.70,
                "bytes_per_token_floor": 1.5,
                "chars_per_token_floor": 1.5,
                "multiplier": 1.20
            }
        }), encoding="utf-8")

    def tearDown(self):
        self.tmp.cleanup()

    def args(self, request, limit=10000, exact=None):
        return argparse.Namespace(
            request=str(request), model="fixture-model", context_limit=limit,
            exact_count=exact, reserve_output=None, reserve_reasoning=None,
            policy=str(self.policy)
        )

    def write(self, name, text):
        p = self.dir / name
        p.write_text(text, encoding="utf-8")
        return p

    def test_exact_count_allows_with_headroom(self):
        p = self.write("request.json", '{"input":"hello"}')
        result, code = module.decision(self.args(p, exact=1000))
        self.assertEqual(code, 0)
        self.assertEqual(result["decision"], "ALLOW")
        self.assertEqual(result["count_source"], "exact")
        self.assertGreater(result["headroom_tokens"], 0)

    def test_exact_count_blocks_oversize(self):
        p = self.write("request.json", '{"input":"hello"}')
        result, code = module.decision(self.args(p, exact=9000))
        self.assertEqual(code, 2)
        self.assertEqual(result["decision"], "REDUCE")
        self.assertGreater(result["required_reduction_tokens"], 0)

    def test_token_dense_ascii_estimate_is_not_bytes_div_four(self):
        p = self.write("dense.json", '{"x":"' + ('{}[],:!?' * 1000) + '"}')
        result, _ = module.decision(self.args(p, limit=100000))
        naive = result["request_bytes"] / 4
        self.assertGreater(result["input_tokens"], naive)
        self.assertEqual(result["count_source"], "estimated")

    def test_unicode_estimate_uses_byte_and_character_bounds(self):
        p = self.write("unicode.json", '{"text":"' + ('漢字 tiếng Việt 🚀 ' * 500) + '"}')
        result, _ = module.decision(self.args(p, limit=100000))
        self.assertGreater(result["request_bytes"], result["request_chars"])
        self.assertGreater(result["input_tokens"], 0)

    def test_estimated_near_boundary_requires_exact_recount(self):
        p = self.write("large.txt", "a" * 8000)
        result, code = module.decision(self.args(p, limit=10000))
        self.assertIn(result["decision"], {"RECOUNT_REQUIRED", "REDUCE"})
        self.assertNotEqual(code, 0)

    def test_changed_payload_has_changed_hash(self):
        a = self.write("a.txt", "first")
        b = self.write("b.txt", "second")
        ra, _ = module.decision(self.args(a, exact=10))
        rb, _ = module.decision(self.args(b, exact=10))
        self.assertNotEqual(ra["request_sha256"], rb["request_sha256"])

    def test_invalid_context_limit_fails(self):
        p = self.write("request.json", "{}")
        with self.assertRaises(ValueError):
            module.decision(self.args(p, limit=0, exact=1))


if __name__ == "__main__":
    unittest.main()
