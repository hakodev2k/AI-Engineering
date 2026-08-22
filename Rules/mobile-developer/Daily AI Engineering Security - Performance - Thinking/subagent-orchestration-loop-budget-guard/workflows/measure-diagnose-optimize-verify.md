# Workflow: Measure → Diagnose → Hypothesize → Optimize → Measure Again

## Trigger
Repeated subagent waits/status checks, stale child state, token/latency spike, or wrong status-tool routing.

## Goal
Bound idle coordination overhead while preserving correct child execution and result collection.

## Inputs
Affected trace, lifecycle/status events, tool selections, context-token estimates, budget policy.

## Baseline
Record orchestration-only turns, no-progress cycles, wait intervals, estimated orchestration tokens, and terminal-to-recognition latency.

## Stages
1. **Observe** — collect an affected trace without changing behavior.
2. **Measure baseline** — classify progress vs no-progress events.
3. **Diagnose** — identify wrong-tool routing, stale status, missing terminal event, or aggressive polling.
4. **Form hypothesis** — choose one cause and one expected measurable change.
5. **Optimize** — integrate watchdog/reconciliation/backoff for that cause only.
6. **Measure again** — replay the same fixture/workload.
7. **Verify** — independent verifier confirms result correctness.

## Responsible agent
Implementation owner for stages 1–6; `subagents/performance-verifier.md` for stage 7.

## Tools
`python scripts/orchestration_watchdog.py`, runtime status API, trace parser, test runner.

## Outputs
Before/after metrics, watchdog decisions, reconciliation evidence, verifier verdict.

## Checkpoints
Baseline captured; hypothesis explicit; no-progress budget active; authoritative reconciliation works; result collection tested.

## Metrics
Orchestration turns/task, estimated orchestration tokens/task, wrong-tool count, stale-status count, p95 child-terminal-to-parent-recognition latency, result correctness.

## Retry policy
Maximum 2 hypotheses. Each retry must be based on a measured failure. Never widen budgets simply to suppress a block.

## Stop conditions
Verified improvement; no measurable improvement after two hypotheses; correctness regression; unsafe/missing authoritative status source.

## Failure path
Revert candidate behavior, retain baseline evidence, stop automatic polling, and escalate with exact trace and budget counters.

## Definition of Done
Lower or bounded orchestration overhead, no result loss, lifecycle reconciliation verified, and all package references valid.