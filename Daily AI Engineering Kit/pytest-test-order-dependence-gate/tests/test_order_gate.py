from __future__ import annotations

import importlib.util
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("order_gate", ROOT / "scripts/order_gate.py")
assert SPEC and SPEC.loader
GATE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(GATE)


class OrderGateTests(unittest.TestCase):
    def test_parse_collected_nodeids_filters_noise_and_duplicates(self):
        output = "tests/test_a.py::test_one\n2 tests collected\ntests/test_a.py::test_one\ntests/test_b.py::TestB::test_two\n"
        self.assertEqual(
            ["tests/test_a.py::test_one", "tests/test_b.py::TestB::test_two"],
            GATE.parse_collected_nodeids(output),
        )

    def test_permutations_are_deterministic(self):
        nodeids = ["a::x", "b::y", "c::z", "d::w"]
        first = GATE.generate_permutations(nodeids, 42, 5)
        second = GATE.generate_permutations(nodeids, 42, 5)
        self.assertEqual(first, second)
        self.assertTrue(all(sorted(order) == sorted(nodeids) for order in first))

    def test_candidate_sequences_put_victim_last(self):
        sequences = GATE.candidate_sequences("v::test", ["a::test", "b::test"])
        self.assertEqual(["a::test", "v::test"], sequences[0])
        self.assertEqual(["b::test", "v::test"], sequences[1])
        self.assertEqual("v::test", sequences[-1][-1])

    def test_validate_config_rejects_unbounded_values(self):
        config = {
            "version": 1,
            "permutations": 101,
            "seed": 1,
            "timeout_seconds": 10,
            "max_reproduced_failures": 1,
            "max_tests": 10,
            "pytest_command": ["python", "-m", "pytest"],
            "collection_args": ["--collect-only", "-q"],
            "run_args": ["-q"],
            "environment": {},
        }
        with self.assertRaises(ValueError):
            GATE.validate_config(config)


if __name__ == "__main__":
    unittest.main()
