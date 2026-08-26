# Workflow: Measure and Optimize Control Polling

## Trigger
Token/cost spike, high wait-family call count, long-running subagents, or repeated tool outputs.

## Goal
Reduce token amplification without reducing task correctness or state-change visibility.

## Inputs
Representative trace, task acceptance criteria, policy, lifecycle state and dedup identifiers.

## Baseline
Run the workload unchanged and record tokens/task, cached tokens/task, wait/no-change turns, duplicate outputs, latency and task success.

## Context
Preserve all correctness-critical instructions and state. Use hashes for large repeated tool outputs when possible.

## Stages
1. **Observe:** locate model-visible control events and repeated outputs.
2. **Measure baseline:** run the profiler.
3. **Diagnose:** determine whether polling, stale lifecycle state, cache expiry, or dedup loss dominates.
4. **Hypothesize:** define one measurable change and expected effect.
5. **Implement:** adjust backoff, event delivery, lifecycle termination, or durable dedup state.
6. **Measure again:** replay the same workload.
7. **Improved?** If no, revise at most twice; if yes, continue.
8. **Verify:** Token Verifier confirms quality and state-change coverage.

## Responsible agent
Performance/token engineer; Token Verifier owns independent verification.

## Tools
`remeter_profiler.py`, trace exporter, test runner, runtime lifecycle logs.

## Outputs
Baseline profile, root cause, hypothesis, implementation evidence, before/after comparison, verifier decision.

## Checkpoints
After baseline; before changing poll cadence; after post-change trace; before rollout.

## Metrics
Tokens/task, no-change cached tokens, tokens/useful state change, duplicate outputs, p50/p95 latency, task success.

## Retry policy
Maximum 2 optimization iterations.

## Stop conditions
Stop on quality regression, missed required state change, ambiguous irreversible work, or exhausted retries.

## Failure path
Restore conservative polling and escalate with trace evidence.

## Verification
Equivalent workload must show measurable token reduction and unchanged-or-better task acceptance.

## Definition of Done
Baseline captured, limitation identified, improvement implemented, metrics compared, tests pass, risks documented, independent verification complete.
