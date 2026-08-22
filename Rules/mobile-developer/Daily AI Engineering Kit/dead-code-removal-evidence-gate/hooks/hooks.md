# Hooks

## PreTask — Candidate identity validation
**Trigger:** before evidence collection.
**Preconditions:** candidate identifier and repository root are known.
**Action:** record current revision and run a dry reference scan.
**Command:** `python scripts/scan-references.py --repo . --candidate <identifier> --output .dead-code/reference-scan-before.json`
**Expected result:** machine-readable report with searched files and matched references.
**Failure behavior:** block if the candidate is ambiguous or the scan cannot complete after one retry.
**Blocks:** yes.

## PreReview — Evidence validation
**Trigger:** before independent review.
**Preconditions:** evidence JSON exists.
**Action:** validate structure and policy-required channels.
**Command:** `python scripts/validate-evidence.py .dead-code/evidence.json --policy config/dead-code-policy.json`
**Expected result:** exit 0 with no blocking findings.
**Failure behavior:** return to Evidence Analyst; do not review incomplete evidence.
**Blocks:** yes.

## PreRemoval — Approval and freshness gate
**Trigger:** immediately before code/file removal.
**Preconditions:** reviewer decision is `accepted`.
**Action:** re-run evidence validation and verify approval fields for high-risk cases.
**Command:** `python scripts/validate-evidence.py .dead-code/evidence.json --policy config/dead-code-policy.json --require-removal-ready`
**Expected result:** `removal_ready=true`.
**Failure behavior:** stop; no modifications.
**Blocks:** yes.

## PostRemoval — Reference rescan
**Trigger:** after removal edit.
**Action:** search repository again for candidate/stale registration references.
**Command:** `python scripts/scan-references.py --repo . --candidate <identifier> --output .dead-code/reference-scan-after.json`
**Expected result:** zero unexplained live references.
**Failure behavior:** block completion; restore or revise removal.
**Blocks:** yes.

## PreComplete — Verification gate
**Trigger:** before declaring success.
**Action:** validate final evidence, check post-removal scan path exists, and ensure `verification_status=verified`.
**Command:** `python scripts/validate-evidence.py .dead-code/evidence.json --policy config/dead-code-policy.json --require-verified`
**Expected result:** exit 0.
**Failure behavior:** final state is not verified.
**Blocks:** yes.