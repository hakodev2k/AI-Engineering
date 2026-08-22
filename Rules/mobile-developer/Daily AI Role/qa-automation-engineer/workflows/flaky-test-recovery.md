# Workflow: Flaky Test Recovery

## Trigger
Repeated nondeterministic test behavior or quarantine review.

## Goal
Remove the root cause of flakiness and safely restore trustworthy coverage.

## Inputs
Failure history, artifacts, test code, environment metadata, quarantine record.

## Stages
1. Coordinator confirms sufficient evidence of nondeterminism.
2. Repository Explorer gathers recent changes, fixture/config, execution topology.
3. Automation Implementer applies `skills/flaky-test-triage.md` to reproduce with bounded stress.
4. Root-cause hypotheses are ranked by evidence.
5. Fix is applied to test, fixture, product, or routed to infrastructure owner.
6. Focused stress run verifies the fix.
7. Relevant regression suite runs.
8. Test Reviewer checks that retries/sleeps/quarantine were not used to mask the issue.
9. Verification Agent confirms acceptance threshold and quarantine removal eligibility.
10. Coordinator records root cause and prevention improvement.

## Parallelizable work
Historical CI analysis and source/fixture inspection may occur in parallel. Do not run competing mutable tests against the same shared data.

## Retry policy
At most two diagnosis cycles. If no stronger evidence emerges, stop and escalate.

## Definition of Done
Root cause is identified with evidence, remediation is reviewed, reliability threshold passes, and prevention lesson is recorded.
