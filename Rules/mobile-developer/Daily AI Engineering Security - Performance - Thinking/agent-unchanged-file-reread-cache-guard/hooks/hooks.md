# Hooks

## PreRead
**Trigger:** before a file-read tool executes.
**Action:** call the guard with canonical path/range and context requirement.
**Command:** `python scripts/read_cache_guard.py check <path> --start <line> --end <line> [--require-context]`
**Expected result:** exit 0 with `UNCHANGED_READ` receipt or exit 2 indicating a real read is required.
**Failure behavior:** on exit 3/4, perform the real read and emit `guard_degraded`; never block correctness.

## PostRead
**Trigger:** after a real read succeeds.
**Action:** record the exact returned range and byte count.
**Command:** `python scripts/read_cache_guard.py record <path> --start <line> --end <line> --returned-bytes <n>`
**Expected result:** fingerprint/range is persisted atomically.
**Failure behavior:** continue the task but disable cache hits for that path/session until the ledger is healthy.

## PostMutation
**Trigger:** after edit/write/delete/move/checkout/merge or known external mutation.
**Action:** invalidate the affected canonical path before any later read suppression.
**Command:** `python scripts/read_cache_guard.py invalidate <path>`
**Expected result:** zero or more entries removed.
**Failure behavior:** force real reads for affected paths.

## PostCompaction
**Trigger:** after context compaction/summarization.
**Action:** preserve fingerprints but downgrade exact-text residency.
**Command:** `python scripts/read_cache_guard.py compact`
**Expected result:** all ledger entries become `context_residency=unknown`.
**Failure behavior:** clear/ignore the ledger and perform normal reads.

## FinalVerification
**Trigger:** before reporting optimization success.
**Action:** collect stats and compare with baseline; run fixture tests.
**Command:** `python scripts/read_cache_guard.py stats` plus the test procedure in `tests/test-plan.md`.
**Expected result:** measured duplicate-byte reduction meets threshold; false cache hits=0.
**Failure behavior:** report Measured but not Verified; do not claim success.
