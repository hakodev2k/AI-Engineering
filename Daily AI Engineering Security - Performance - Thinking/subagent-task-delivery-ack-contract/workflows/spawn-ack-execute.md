# Workflow: Spawn → ACK → Execute

## Trigger
Parent delegates work to an asynchronous or named child.

## Goal
Ensure execution is bound to the intended task payload rather than inherited/stale context.

## Inputs
Canonical task, child type, scope, permissions, ACK deadline.

## Baseline
Measure current spawn-to-first-action behavior and whether the runtime emits recipient-consumption evidence.

## Context
Record runtime/version, child identity, transport, parent task, and permission profile.

## Stages
1. **Observe** current delivery behavior.
2. **Measure baseline** ACK visibility and latency.
3. **Diagnose** gaps: transport acceptance vs recipient consumption.
4. **Form hypothesis** for missing delivery/ACK.
5. **Implement handshake** with task hash and sequence.
6. **Spawn and deliver** sequence 1.
7. **ACK checkpoint** — no task action accepted before matching ACK.
8. **Execute** acknowledged work.
9. **Follow-up checkpoint** — material update requires seq+1 ACK.
10. **Verify** trace and output independently.

## Responsible agent
Parent orchestrator for stages 1-9; Delegation Verifier for stage 10.

## Tools
Native spawn/message/cancel APIs, hash function, `scripts/delivery_guard.py`.

## Outputs
Validated delegation trace, acknowledged sequence, child result, verification status.

## Checkpoints
Spawn success is insufficient; first action after ACK; completion references latest acknowledged sequence.

## Metrics
ACK latency/rate, retries, mismatch count, action-before-ACK count, successful delegated completions.

## Retry policy
One redelivery. If unsuccessful, cancel and re-spawn once. No third child.

## Stop conditions
Verified child completion; fallback to parent after retry exhaustion; security boundary uncertainty.

## Failure path
Preserve trace, cancel unacknowledged child, do not trust its mutations, reconcile any possible side effects, then use bounded recovery.

## Verification
Run validator and independent verifier.

## Definition of Done
Trace valid, task acknowledged before action, latest follow-up acknowledged, output in scope, tests pass, independent status `verified`.