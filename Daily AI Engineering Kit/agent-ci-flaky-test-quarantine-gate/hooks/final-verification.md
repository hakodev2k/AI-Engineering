# Final Verification Hook

**Trigger:** before declaring the workflow verified or removing quarantine.

**Preconditions:** candidate revision is fixed; recovery evidence and approvals are available.

**Actions:**
1. Run `python scripts/verify_package.py` for package integrity.
2. Run `python -m unittest discover -s tests -v` for deterministic gate tests.
3. Confirm project-specific isolated recovery reached `recovery_consecutive_passes`.
4. Confirm the containing test suite passed once.
5. Inspect the candidate diff for skips, assertion weakening, timeout/sleep inflation, disabled security checks, unrelated public-contract changes, and secrets.
6. Verification Agent records `verified`, `rejected`, or `blocked`.

**Expected result:** all deterministic commands exit 0 and independent status is `verified`.

**Failure behavior:** block completion and preserve outputs. Build/test repair cycles are capped at 2.

**Blocking:** yes.
