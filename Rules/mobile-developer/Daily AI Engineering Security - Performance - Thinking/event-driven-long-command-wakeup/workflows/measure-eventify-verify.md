# Workflow — Measure, Eventify, Verify

## Trigger
A long-running command/tool produces repeated wait/status turns, excessive token usage, stale running state, or poor completion-detection latency.

## Goal
Replace model-driven busy waiting with event-driven or bounded deterministic waiting while preserving correctness and safe cancellation.

## Inputs
Execution traces, process lifecycle API/events, baseline metrics, `config/wait-policy.json`, command classes, and token telemetry.

## Baseline
Capture at least: process wall time, wait-only model turns, estimated wait tokens, poll interval distribution, no-progress polls, completion-detection delay, total task latency, and post-deliverable polls.

## Context
Use `skills/long-command-baseline.md` for diagnosis and `rules/wait-loop-rules.md` as invariants.

## Stages
1. **Observe** — Select representative commands and identify yield-to-terminal lifecycle.
2. **Measure baseline** — Reproduce existing polling behavior and record metrics.
3. **Diagnose** — Determine whether authoritative completion/output events exist and why model polling occurs.
4. **Form hypothesis** — Prefer event-driven resume; otherwise define deterministic backoff/budget policy.
5. **Implement improvement** — Wire runtime event to the correct suspended task or insert deterministic watchdog outside the model loop.
6. **Measure again** — Repeat the same workload classes and context-size bands.
7. **Improved?** — Require fewer wait-only model turns/tokens without unacceptable detection latency or missed completion.
8. **Independent verification** — `subagents/wait-performance-reviewer.md` validates traces and safety behavior.
9. **Complete** — Record Implemented, Measured, and Verified separately.

## Responsible agent
Performance implementation owner for stages 1–7; independent reviewer for stage 8.

## Tools
Process event stream, structured traces, `scripts/wait_budget_guard.py`, benchmark scripts already present in the host project, and metrics/log tooling.

## Outputs
Baseline, root-cause hypothesis, implementation record, before/after metrics, watchdog evidence, independent review, and residual risks.

## Checkpoints
- Baseline exists before changes.
- Event source is authoritative for the target process/session.
- Resume event is correlated to the correct process and task.
- Poll fallback has bounded count/no-progress/token budgets.
- Terminal state disables future waits.
- Required output and exit status are collected.

## Metrics
Wait-only model turns/command, estimated wait tokens/command, percentage of waits resolved without model re-entry, p50/p95 completion-detection delay, task latency, false-hang escalation rate, post-deliverable poll count, and concurrency occupancy.

## Retry policy
At most 2 optimization attempts per hypothesis. A retry requires a materially different implementation or new evidence. Benchmark reruns caused by transient infrastructure noise may be repeated once without counting as a new hypothesis.

## Stop conditions
Stop on missing/mis-correlated completion events, lost process output, unsafe cancellation behavior, or exhausted retry budget. Escalate rather than falling back to unbounded model polling.

## Failure path
Restore the prior correct execution behavior, keep the bounded watchdog if it is independently safe, capture the failed trace, and escalate. If event-driven support is unavailable, retain deterministic backoff with hard budgets.

## Verification
Fast, silent-long, progressive-long, hung, and post-deliverable-cleanup fixtures must all terminate in expected states. Before/after metrics must use comparable contexts/workloads.

## Definition of Done
**Implemented:** event-driven resume or bounded non-model wait controller is integrated.

**Measured:** before/after wait-turn, token, latency, and correctness metrics exist.

**Verified:** independent reviewer reproduces improvement, confirms all loops are bounded, and finds no missed completion/output or unsafe cancellation.
