# Workflow — Measure, Diagnose, Optimize Permission Critical Path

## Trigger
Classifier stalls, permission-mode latency regression, slow tool-call complaints, repeated classifier errors, or planned permission-path changes.

## Goal
Reduce avoidable authorization-path latency and retry waste with security controls preserved.

## Inputs
Representative trace JSONL, configuration/version metadata, classifier budget, dispatch-gap budget, workload.

## Baseline
Collect before-change traces using `skills/permission-path-baseline.md`. Do not optimize before baseline attribution.

## Context
Include only trace/configuration data needed for latency attribution and security verification.

## Stages
1. **Observe** — capture proposal→classifier→approval→dispatch→result events.
2. **Measure baseline** — run analyzer; record classifier, dispatch-gap, approval, and execution metrics.
3. **Diagnose** — Permission Performance Investigator selects the dominant avoidable span and classifies failure taxonomy.
4. **Form hypothesis** — one hypothesis only per iteration, with expected metric movement.
5. **Implement improvement** — examples: enforce effective timeout; stop deterministic retries; repair classifier request construction; repair completed-classifier→dispatch handoff; route already-approved deterministic cases through existing policy; add safe manual fallback.
6. **Measure again** — replay same workload/distribution.
7. **Improved?** Require lower targeted metric and no task-success/security regression. If no, re-evaluate once.
8. **Verify** — independent reviewer checks trace comparison and permission behavior.
9. **Complete** — document measured and verified state.

## Responsible agent
Permission Performance Investigator diagnoses. Implementation owner changes one component. Independent verifier validates the result.

## Tools
Trace analyzer, runtime logs, test harness, existing permission/security tests.

## Outputs
Before/after metric report, hypothesis outcome, security-preservation evidence, residual risks.

## Checkpoints
- CP1 representative baseline captured.
- CP2 dominant span identified.
- CP3 one safe change selected.
- CP4 post-change trace captured.
- CP5 permission behavior regression-tested.

## Metrics
Classifier p50/p95/p99; dispatch-gap p95; tool execution p95; authorization share; retry count; violation rate; task success.

## Retry policy
At most two optimization iterations. Classifier request retries: at most two per logical action, with bounded backoff. Deterministic malformed-request errors are not retried.

## Stop conditions
Measured+verified improvement; two failed optimization iterations; external dependency dominates with no safe local action; or the next optimization would weaken security.

## Failure path
Revert or disable only the performance change, not the security boundary. Use manual approval/task suspension as safe fallback when classifier service cannot provide a decision.

## Verification
Compare same-workload traces and run existing permission/sandbox tests. Never claim improvement from latency alone if task correctness or security behavior regresses.

## Definition of Done
Evidence documented; baseline measured; dominant span and root cause identified; improvement implemented; post-change metrics captured; bounded retries enforced; security tests pass; no unsafe fallback; independent verification complete.