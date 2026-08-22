# Final Verification Hook

**Trigger:** after implementation and before declaring success.

**Preconditions:** sanitized reproduction chain and implementation tests exist.

**Action:** run `python -m unittest discover -s tests -p 'test_*.py'`, then run `python scripts/redirect_gate.py --input <sanitized-chain.json> --policy config/policy.json --output redirect-gate-report.json` for every accepted chain. Inspect the repository diff for secret values and unrelated changes.

**Expected result:** tests exit 0; accepted chains exit 0; intentionally malicious regression chains are rejected by tests; independent Verification Agent returns `verified`.

**Failure behavior:** block completion and return evidence to the bounded workflow retry. Do not weaken policy to obtain a passing result.

**Blocking:** yes.
