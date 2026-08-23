# Pre-Quarantine Hook

**Trigger:** immediately before any test is marked skipped/quarantined or removed from a blocking suite.

**Preconditions:** schema-valid evidence and configured policy exist.

**Action:** run `python scripts/flaky_gate.py evaluate --evidence <evidence.json> --policy config/policy.json`.

**Expected result:** exit code 0 and status `quarantine_eligible`.

**Failure behavior:** preserve stdout/stderr and block quarantine. `protected_test`, `deterministic_failure`, `stable_pass`, invalid input, or insufficient evidence are blocking results.

**Approval:** even with a passing hook, stop for human approval when `require_human_approval_for_quarantine` is true. This hook never grants approval.
