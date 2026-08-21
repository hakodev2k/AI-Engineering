#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "read_replay_guard.py"
CONFIG = ROOT / "config" / "budget.json"


def run_case(payload):
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as f:
        json.dump(payload, f)
        name = f.name
    try:
        return subprocess.run([sys.executable, str(SCRIPT), name, "--config", str(CONFIG)], text=True, capture_output=True, check=False)
    finally:
        Path(name).unlink(missing_ok=True)


class ReplayGuardTests(unittest.TestCase):
    def test_unique_reads_pass(self):
        p = {"compaction_turns":[5], "events":[
            {"turn":1,"artifact":"a","content_sha256":"h1","tokens":100},
            {"turn":6,"artifact":"a","content_sha256":"h2","tokens":100}
        ], "provider_usage":[]}
        self.assertEqual(run_case(p).returncode, 0)

    def test_same_content_post_compaction_blocks(self):
        p = {"compaction_turns":[5], "events":[
            {"turn":1,"artifact":"a","content_sha256":"h1","tokens":1000},
            {"turn":6,"artifact":"a","content_sha256":"h1","tokens":1000}
        ], "provider_usage":[]}
        r = run_case(p)
        self.assertEqual(r.returncode, 3)
        self.assertIn("post-compaction", r.stdout)

    def test_high_cache_ratio_blocks(self):
        p = {"compaction_turns":[], "events":[], "provider_usage":[{"input_tokens":1000,"cache_read_tokens":12000}]}
        self.assertEqual(run_case(p).returncode, 3)

    def test_missing_hash_is_invalid(self):
        p = {"compaction_turns":[], "events":[{"turn":1,"artifact":"a","tokens":100}], "provider_usage":[]}
        self.assertEqual(run_case(p).returncode, 2)


if __name__ == "__main__":
    unittest.main()
