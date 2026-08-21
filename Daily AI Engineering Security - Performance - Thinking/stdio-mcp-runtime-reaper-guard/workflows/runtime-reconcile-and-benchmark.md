# Workflow: Runtime Reconcile and Benchmark

## Trigger
Repeated-turn process growth, owner-terminal leak, reconnect/restore spawn, resource-budget breach, or lifecycle-guard change.

## Goal
Bound agent-owned local runtime growth while preserving correct tool behavior and legitimate concurrency.

## Inputs
Representative N-turn task, runtime registry, process snapshots, process/RSS budgets, grace period, runtime reuse policy.

## Baseline
Run at least five representative tool-enabled turns without the proposed optimization. Record per turn: spawn count, reuse count, owned live processes, duplicate runtime keys, RSS if available, tool latency, task success, and survivors after owner termination.

## Context
Use the same machine/runtime configuration for before/after measurement when possible. Record OS, agent build, configured local tools, and benchmark count. Do not record secrets.

## Stages
1. **Observe** — Runtime Lifecycle Verifier captures baseline and leak slope.
2. **Diagnose** — identify whether growth comes from per-turn spawn, failed disposal, descendant leakage, restore recreation, or missing reuse.
3. **Form hypothesis** — state one measurable change, e.g. `reuse same runtime key within owner` or `reap terminal-owner descendants after grace`.
4. **Implement** — wire ownership registration, reuse, budget gate, and cleanup only for the diagnosed cause.
5. **Measure again** — rerun exactly the same N-turn scenario.
6. **Improved?** — require lower duplicate/orphan count and bounded resource slope without worse task success. If no, re-evaluate the hypothesis.
7. **Verify** — run unit fixtures including PID reuse, shared ownership, already-exited process, and budget breach.
8. **Complete** — independent verifier returns PASS.

## Responsible agent
Implementation agent changes host lifecycle code. Runtime Lifecycle Verifier owns final verification and must be independent from the implementation pass.

## Tools
`scripts/runtime_reaper.py`, `tests/test_runtime_reaper.py`, OS process snapshots, task benchmark runner.

## Outputs
Baseline JSON, post-change JSON, cleanup audit, unit-test result, final verification report.

## Checkpoints
- Before implementation: a measurable baseline exists.
- Before cleanup: ownership identity is proven.
- Before forced termination: graceful deadline elapsed and identity still matches.
- Before completion: same-scenario before/after comparison exists.

## Metrics
Owned process count, orphan count, duplicate runtime keys, spawn/reuse ratio, RSS slope, p95 tool latency, graceful cleanup rate, forced kills, task success rate.

## Retry policy
Maximum two diagnose/implement/re-measure cycles. Each retry must change a falsified hypothesis or address new evidence. Process enumeration may retry once on transient OS errors.

## Stop conditions
Stop on uncertain ownership, PID reuse mismatch, unrelated-process targeting, no measurable improvement after two cycles, registry corruption, or task correctness regression that cannot be fixed within the retry budget.

## Failure path
Preserve sanitized metrics, block further new spawns when safe hard budgets are exceeded, leave uncertain processes untouched, and escalate to a human operator. Do not solve the benchmark by widening budgets indefinitely.

## Verification
The verifier must confirm zero owned non-shared survivors for terminal owners after grace, no target selection for PID-reuse fixtures, bounded process/RSS growth across repeated turns, and passing task tests.

## Definition of Done
Baseline captured; root cause documented; guard integrated; tests pass; before/after comparison is complete; resource growth is bounded; no unrelated processes are touched; final independent verification is PASS; residual risk is documented.