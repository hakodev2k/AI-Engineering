# Workflow: Verify Review Quorum Before Merge

## Trigger
A pull request reaches merge-ready state or modifies a high-risk/protected path.

## Goal
Block fabricated review consensus while preserving normal code/security review and a clear path to legitimate independent approval.

## Inputs
PR metadata, changed paths, author controller provenance, reviewer provenance, CODEOWNERS result, policy.

## Baseline
Record raw approval count, verified unique-controller count, human CODEOWNER presence, and current CI/security-test state before applying the gate.

## Stages
1. **Observe** — collect author/reviewer identities and changed paths without trusting display names.
2. **Measure baseline** — count raw approvals and current status checks.
3. **Diagnose** — resolve verified controller IDs and flag unknown, duplicate, or author-controlled approvals.
4. **Form hypothesis** — if raw quorum exceeds verified quorum, identify which provenance gap explains the difference.
5. **Implement improvement** — obtain missing attestation or a genuinely independent reviewer; do not modify code solely to satisfy identity policy.
6. **Measure again** — rerun provenance gate and normal CI/security checks.
7. **Improved?** — retry provenance retrieval at most twice; otherwise block and escalate.
8. **Verify** — independent Provenance Security Reviewer confirms controller separation and CODEOWNER requirement.
9. **Complete** — merge only after provenance gate and normal repository checks pass.

## Responsible agents
Repository integration gathers metadata; provenance reviewer verifies; merge automation enforces.

## Tools
GitHub metadata, attestation verifier, CODEOWNERS resolver, `scripts/review_provenance_gate.py`, normal CI/security tests.

## Outputs
Machine-readable merge decision, counted/rejected review evidence, verification record.

## Checkpoints
Before counting approval, before any exception, and immediately before merge.

## Metrics
Raw approvals vs unique controllers, unknown-provenance rate, duplicate-controller rate, human CODEOWNER coverage, blocked attempts, false-block review count.

## Retry policy
Maximum two provenance-retrieval attempts. No autonomous security-policy relaxation.

## Stop conditions
Missing provenance after retries, author-controlled quorum, insufficient unique controllers, missing human CODEOWNER, or failed normal security checks.

## Failure path
Block merge, preserve evidence, request independent review or authorized exception. Never replace verification with reviewer-count heuristics.

## Verification
Implementing contributor/agent cannot be the only security verifier.

## Definition of Done
Verified controller quorum passes, required human CODEOWNER is present, author-controlled approvals do not count, normal tests/security checks pass, evidence is retained, and no blocking policy violation remains.
