# Hook: Final Verification

**Trigger:** after remediation and tests, before declaring completion.

**Preconditions:** current scanner report, test/build output, final diff, approval record when required.

**Actions:** rerun `scripts/scan_transaction_side_effects.py`; then run `python scripts/verify_findings.py transaction-side-effect-findings.json --allow-review` only after every review-level hit has an evidence-backed disposition. Run repository build/tests and inspect `git diff`.

**Expected result:** no unresolved high findings; relevant build/tests pass; changes are scoped; approval boundaries respected.

**Failure behavior:** one retry for transient tool failure; at most two code repair cycles for change-caused test failures; otherwise stop and preserve evidence.

**Blocking:** yes.