#!/usr/bin/env python3
from __future__ import annotations

import json
import sqlite3
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "admission_ledger.py"


def call(db: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run([sys.executable, str(SCRIPT), "--db", str(db), *args], text=True, capture_output=True, check=False)


def main() -> int:
    failures: list[str] = []
    with tempfile.TemporaryDirectory() as tmp:
        db = Path(tmp) / "ledger.sqlite"
        tests: list[tuple[str, bool]] = []

        tests.append(("init", call(db, "init").returncode == 0))
        first = call(db, "admit", "--run-id", "r1", "--idempotency-key", "k1", "--input-hash", "sha256:abc", "--side-effect-free")
        tests.append(("durable admit", first.returncode == 0 and json.loads(first.stdout)["status"] == "accepted"))
        duplicate = call(db, "admit", "--run-id", "r1", "--idempotency-key", "k1", "--input-hash", "sha256:abc", "--side-effect-free")
        tests.append(("idempotent re-admit", duplicate.returncode == 0))
        conflict = call(db, "admit", "--run-id", "r2", "--idempotency-key", "k1", "--input-hash", "sha256:different")
        tests.append(("idempotency conflict blocks", conflict.returncode == 2))
        cp = call(db, "checkpoint", "--run-id", "r1", "--checkpoint-id", "cp-1")
        tests.append(("checkpoint transition", cp.returncode == 0 and json.loads(cp.stdout)["status"] == "checkpointed"))
        done = call(db, "complete", "--run-id", "r1")
        tests.append(("complete transition", done.returncode == 0 and json.loads(done.stdout)["status"] == "completed"))
        illegal = call(db, "checkpoint", "--run-id", "r1", "--checkpoint-id", "cp-2")
        tests.append(("terminal run cannot regress", illegal.returncode == 2))

        fresh = call(db, "admit", "--run-id", "r-fresh", "--idempotency-key", "k-fresh", "--input-hash", "sha256:fresh")
        tests.append(("second admission", fresh.returncode == 0))
        reconcile_fresh = call(db, "reconcile", "--lost-after-seconds", "3600")
        tests.append(("fresh run not falsely lost", reconcile_fresh.returncode == 0 and json.loads(reconcile_fresh.stdout)["lost_count"] == 0))

        old = call(db, "admit", "--run-id", "r-lost", "--idempotency-key", "k-lost", "--input-hash", "sha256:lost")
        tests.append(("lost candidate admission", old.returncode == 0))
        with sqlite3.connect(db) as conn:
            conn.execute("UPDATE admissions SET accepted_at='2026-01-01T00:00:00+00:00' WHERE run_id='r-lost'")
            conn.commit()
        reconcile_lost = call(db, "reconcile", "--lost-after-seconds", "1")
        lost_report = json.loads(reconcile_lost.stdout)
        tests.append(("stale accepted run becomes lost", reconcile_lost.returncode == 2 and "r-lost" in lost_report["lost_run_ids"]))
        lost_row = call(db, "get", "--run-id", "r-lost")
        tests.append(("lost state is durable", lost_row.returncode == 0 and json.loads(lost_row.stdout)["status"] == "lost"))

        for name, ok in tests:
            print(("PASS" if ok else "FAIL") + " - " + name)
            if not ok:
                failures.append(name)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
