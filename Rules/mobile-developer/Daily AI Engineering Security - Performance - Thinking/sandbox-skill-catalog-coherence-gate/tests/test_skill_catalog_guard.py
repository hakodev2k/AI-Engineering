#!/usr/bin/env python3
"""Dependency-free tests for skill_catalog_guard.py."""
from __future__ import annotations

import hashlib
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "skill_catalog_guard.py"
POLICY = ROOT / "config" / "policy.json"


def catalog_hash(entries: list[dict]) -> str:
    canonical = [{"id": e["id"], "path": e["path"]} for e in sorted(entries, key=lambda x: x["id"])]
    raw = json.dumps(canonical, separators=(",", ":"), sort_keys=True).encode("utf-8")
    return "sha256:" + hashlib.sha256(raw).hexdigest()


def snapshot() -> dict:
    entries = [
        {"id": "git", "path": "/workspace/skills/git/SKILL.md", "readable": True},
        {"id": "test", "path": "/workspace/skills/test/SKILL.md", "readable": True},
    ]
    return {
        "generation_id": "gen-1",
        "catalog_hash": catalog_hash(entries),
        "expected_skills": ["git", "test"],
        "advertised_skills": entries,
        "rebuild_attempts": 0,
    }


def run(snap: dict) -> tuple[int, dict]:
    with tempfile.TemporaryDirectory() as td:
        path = Path(td) / "snapshot.json"
        path.write_text(json.dumps(snap), encoding="utf-8")
        p = subprocess.run(
            [sys.executable, str(SCRIPT), str(path), "--policy", str(POLICY)],
            text=True, capture_output=True, check=False,
        )
        return p.returncode, json.loads(p.stdout or p.stderr)


def test_complete_catalog_allows() -> None:
    code, out = run(snapshot())
    assert code == 0 and out["decision"] == "allow"
    assert out["completeness_ratio"] == 1.0 and out["readability_ratio"] == 1.0


def test_missing_skill_requests_rebuild_once() -> None:
    s = snapshot()
    s["advertised_skills"] = s["advertised_skills"][:1]
    s["catalog_hash"] = catalog_hash(s["advertised_skills"])
    code, out = run(s)
    assert code == 3 and out["decision"] == "rebuild" and out["missing_skills"] == ["test"]


def test_missing_skill_blocks_after_budget() -> None:
    s = snapshot()
    s["advertised_skills"] = s["advertised_skills"][:1]
    s["catalog_hash"] = catalog_hash(s["advertised_skills"])
    s["rebuild_attempts"] = 1
    code, out = run(s)
    assert code == 4 and out["decision"] == "block"


def test_unreadable_skill_requests_rebuild() -> None:
    s = snapshot()
    s["advertised_skills"][1]["readable"] = False
    code, out = run(s)
    assert code == 3 and out["unreadable_skills"] == ["test"]


def test_hash_mismatch_requests_rebuild() -> None:
    s = snapshot()
    s["catalog_hash"] = "sha256:deadbeef"
    code, out = run(s)
    assert code == 3 and "catalog hash" in " ".join(out["findings"])


def test_missing_generation_is_invalid() -> None:
    s = snapshot()
    s.pop("generation_id")
    code, out = run(s)
    assert code == 2 and out["decision"] == "invalid"


if __name__ == "__main__":
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_") and callable(v)]
    for test in tests:
        test()
    print(f"ok: {len(tests)} tests")
