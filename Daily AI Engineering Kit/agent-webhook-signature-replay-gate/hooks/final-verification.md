# Hook: Final Verification

**Trigger:** after implementation and repository tests.

**Preconditions:** final diff exists; provider semantics established; relevant negative tests implemented.

**Actions:**
1. `python -m unittest tests/test_webhook_guard.py`
2. `python scripts/webhook_guard.py verify-fixture --policy config/webhook-policy.json --fixture examples/request.json`
3. Run repository-specific webhook test suite.
4. Verification Agent inspects side-effect ordering and atomic replay behavior.

**Expected result:** all deterministic checks pass and verifier status is `verified`.

**Failure behavior:** preserve logs/evidence; do not deploy or weaken policy.

**Blocks completion:** yes.