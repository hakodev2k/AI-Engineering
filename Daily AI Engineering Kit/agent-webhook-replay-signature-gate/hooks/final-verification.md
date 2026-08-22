# Final Verification Hook

**Trigger:** after implementation and independent verification.

**Action:** run repository build/tests, adversarial webhook tests, `python scripts/validate_evidence.py <evidence.json>`, and inspect changed files for unrelated edits or secret material.

**Expected result:** all commands pass and evidence status is `verified`.

**Failure:** preserve logs and block completion. Transient runner failures may be retried twice; assertion/schema/security failures require correction and re-verification.

**Blocking:** yes.