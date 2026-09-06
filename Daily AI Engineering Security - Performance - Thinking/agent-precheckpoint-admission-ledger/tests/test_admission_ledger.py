#!/usr/bin/env python3
from __future__ import annotations

import json
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

        lost = call(db, "admit", "--run-id", "r-lost", "--idempotency-key", "k-lost", "--input-hash", "sha256:lost")
        tests.append(("second admission", lost.returncode == 0))
        reconcile = call(db, "reconcile", "--lost-after-seconds", "1")
        # The new admission is younger than one second and must not be falsely marked lost.
        tests.append(("fresh run not falsely lost", reconcile.returncode == 0 and json.loads(reconcile.stdout)["lost_count"] == 0))

        for name, ok in tests:
            print(("PASS" if ok else "FAIL") + " - " + name)
            if not ok:
                failures.append(name)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
