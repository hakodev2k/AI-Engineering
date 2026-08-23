# Hook: Final Verification

**Trigger:** after the final schema-related edit and before task completion/PR readiness.

**Preconditions:** final snapshots and drift report are available; required approvals have been recorded; relevant repository tests can be run.

**Action:** re-run the drift command from `hooks/pre-migration.md`, run relevant persistence build/tests, inspect final Git diff and generated SQL, then run `python scripts/verify_package.py` when validating the kit installation.

**Expected result:** deterministic report is non-blocking, tests/build pass, final diff matches intent, approval evidence covers every approval-bound change.

**Failure behavior:** block completion. Build/test failures can return to implementation for at most two fix/retest cycles. A changed schema invalidates previous approval and requires a fresh approval check.

**Blocking:** yes.
