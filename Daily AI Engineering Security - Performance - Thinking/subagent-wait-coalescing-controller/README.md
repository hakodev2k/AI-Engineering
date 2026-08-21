# Subagent Wait Coalescing Controller

**Category:** Performance

## Problem
Multi-agent orchestration can waste most of its turns polling subagents and background tasks that have not changed state. Short timeout loops can repeatedly reprocess large cached context, while stale `running` states or invalid wait targets keep parents cycling without productive work.

## Evidence
See `evidence/research.md`. Current public Codex reports document wait/status calls dominating model-visible tool traffic, high timeout rates with huge cached contexts, stale completed agents still reported as running, and repeated `wait(noop)` calls against nonexistent targets.

## Existing approach
Short-interval `wait`/`wait_agent`, periodic `list_agents`, context caching, and manual interruption/restart.

## Existing limitations
No-change polls still create full reasoning turns, polling cadence is often much shorter than child task duration, stale liveness lacks deterministic expiry, and invalid targets may be retried rather than invalidated.

## Proposed improvement
Move no-change polling out of the model loop: fingerprint child state, coalesce repeated snapshots, use bounded adaptive backoff, add liveness leases and one-shot reconciliation, validate wait targets, and emit model-visible events only for material changes or bounded checkpoints.

## Architecture
- `skills/wait-loop-baseline-and-control.md` defines measurement and control procedure.
- `rules/wait-performance-rules.md` enforces baseline-first optimization and bounded loops.
- `subagents/orchestration-benchmark-agent.md` independently validates results.
- `workflows/measure-coalesce-verify.md` implements Measure → Diagnose → Optimize → Measure again.
- `hooks/pre-wait-state-change-gate.md` blocks redundant waits while preserving critical events.
- `scripts/wait_loop_analyzer.py` measures no-change loops and invalid targets.
- `tests/sample-events.jsonl` provides a simple coalesced example trace.

## Package tree
```text
README.md
evidence/research.md
skills/wait-loop-baseline-and-control.md
rules/wait-performance-rules.md
subagents/orchestration-benchmark-agent.md
workflows/measure-coalesce-verify.md
hooks/pre-wait-state-change-gate.md
scripts/wait_loop_analyzer.py
tests/sample-events.jsonl
```

## Installation
Requires Python 3.9+. Integrate state fingerprinting and polling/backoff in the host orchestrator; use the analyzer for baseline and regression verification.

## Configuration
Set minimum/maximum poll interval, liveness lease, checkpoint deadline, critical event types, acceptable terminal-state detection latency, and maximum no-change ratio. Values should reflect real child task durations rather than arbitrary fast polling.

## Usage
Run:

`python3 scripts/wait_loop_analyzer.py orchestration-events.jsonl --max-no-change-ratio 0.80`

Input JSONL fields can include `event_type`, `child_id`, `state_fingerprint`, `material_change`, `model_turn`, `input_tokens`, and `target_valid`. Exit 0 passes the configured diagnostic threshold; 2 indicates invalid input; 3 identifies a blocking loop/target condition.

## Workflow
Observe → capture baseline → diagnose repeated fingerprints/stale children/invalid targets → hypothesize savings → implement coalescing/backoff/lease reconciliation → measure again → retry once if needed → independently verify.

## Metrics
Wait calls/task, timeout/no-change ratio, model-visible wait turns, tokens/task, repeated status bytes, end-to-end duration, terminal/error/approval detection latency, stale-child recovery rate, invalid wait target count.

## Verification
Compare the same representative workload before and after. Require fewer model-visible no-change turns and lower resource use when measurable. Verify task-level tests/results remain equivalent and critical events are not delayed beyond the configured budget.

## Safety and correctness
Terminal, error, cancellation, approval, and security states always bypass coalescing. Stale children are not assumed complete. No optimization may hide a critical transition merely to reduce tokens or latency.

## Failure handling
Detection: analyzer exit 3, missed event, stale lease, or invalid target. Evidence: event log plus metrics. Retry: maximum two optimization cycles total. Fallback: disable coalescing for the affected child/topology and restore safe polling. Escalate ambiguous liveness rather than looping indefinitely.

## Implemented / Measured / Verified
**Implemented** means the controller integration exists. **Measured** means comparable baseline and post-change metrics were captured. **Verified** means independent benchmark analysis plus task-level correctness checks pass.

## Definition of Done
Baseline captured; root cause identified; no-change state coalescing implemented; invalid target validation active; stale liveness bounded; post-change metrics improve; critical detection latency stays within budget; task tests pass; independent verifier passes; no unbounded retry remains.

## Customization
Adapt fingerprints and critical event types to the host runtime. If an event-driven child completion channel is available, prefer it over polling; retain bounded checkpoint timers only as a recovery mechanism.