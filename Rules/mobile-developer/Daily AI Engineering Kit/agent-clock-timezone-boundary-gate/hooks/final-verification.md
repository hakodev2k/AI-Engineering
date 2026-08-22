# Final Verification Hook

**Trigger:** after implementation and targeted tests.

**Preconditions:** config is valid; all intended edits are present; required approvals have been recorded externally when applicable.

**Action:**

`python scripts/verify_temporal_gate.py --config config/temporal-gate.json`

**Expected result:** exit 0 and `.ai-temporal/verification.json` with `status: verified`.

**Failure behavior:** preserve report and command outputs. Implementation-related failures may return to implementation at most twice. Permission, unknown-semantics, approval, or environment failures block immediately.

**Blocking:** yes.