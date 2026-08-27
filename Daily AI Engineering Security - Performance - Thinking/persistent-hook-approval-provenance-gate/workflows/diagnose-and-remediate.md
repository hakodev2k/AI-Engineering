# Workflow — Diagnose and Remediate Hook Trust
## Trigger
Unexpected hook execution, missing hook UX, or new host integration.
## Goal
Preserve useful hooks without turning model-controlled input into a trust principal.
## Inputs
Execution-path inventory, hook metadata, approval events, trusted roots, policy.
## Baseline
Record current pass/block behavior for SessionStart, SessionEnd, resume/fork and server-initiated session paths.
## Stages
1. Observe exact execution paths.
2. Measure which paths validate approval/hash/cwd.
3. Diagnose the first missing invariant.
4. Form a testable hypothesis.
5. Implement the smallest central gate change.
6. Re-run baseline and adversarial fixtures.
7. Independent review.
## Responsible agent
Implementation agent for stages 1–6; Security Reviewer for stage 7.
## Tools
Source inspection, `scripts/hook_trust_guard.py`, unit tests.
## Outputs
Before/after matrix, violation codes, verification result.
## Checkpoints
After baseline, before code change, after tests, before release.
## Metrics
100% known path coverage; 100% exploit-fixture blocks; zero unauthorized persistent trust.
## Retry policy
At most 2 remediation iterations.
## Stop conditions
Stop on missing authoritative cwd, ambiguous approval origin, or exhausted retries.
## Failure path
Disable affected hook path; require human review.
## Verification
Independent reviewer must reproduce all security-critical tests.
## Definition of Done
Implemented, measured and independently verified with no blocked invariant remaining.
