# Hook: Final Verification

**Trigger:** after reconnect implementation and repository tests.

**Preconditions:** a representative reconnect trace exists and policy is configured.

**Action:**
`python scripts/validate_reconnect_trace.py --trace <trace.json> --policy config/reconnect-policy.json --out .reconnect/verification.json`

**Expected result:** exit code 0 and status `verified`.

**Failure behavior:** preserve validation output and trace; deterministic invariant failures block completion.

**Blocks completion:** yes.
