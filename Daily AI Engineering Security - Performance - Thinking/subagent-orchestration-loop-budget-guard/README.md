# Subagent Orchestration Loop Budget Guard

## Topic
Bound multi-agent wait/status loops that consume model turns, context tokens, and latency without producing progress.

## Category
Performance

## Problem
Subagent coordinators can select the wrong wait tool, trust stale `running` state, or poll too frequently. In long-context tasks, each no-op orchestration turn may reprocess a large cached prompt and amplify cost/latency.

## Evidence
See `evidence/research.md` for August 2026 public issue evidence, interpretation, current approaches, remaining limitations, and source URLs.

## Existing approach
Common runtimes use fixed-interval waits, model-selected orchestration tools, cached child state, and generic retry behavior.

## Existing limitations
Status can diverge across terminal events, runtime state, caches, and UI state. Semantically adjacent wait tools can be selected incorrectly. Fixed polling does not account for progress rate or context cost. Retry loops often have no no-progress/token budget.

## Proposed improvement
Add a progress-aware watchdog that validates the selected tool family, gives terminal lifecycle evidence precedence over stale `running` state, reconciles once against the authoritative runtime, backs off wait intervals, tracks no-progress/model-turn/token budgets, and stops rather than polling indefinitely.

## Package tree
- `README.md`
- `evidence/research.md`
- `config/budget.json`
- `scripts/orchestration_watchdog.py`
- `rules/orchestration-budget.md`
- `skills/orchestration-baseline-and-diagnosis.md`
- `subagents/performance-verifier.md`
- `workflows/measure-diagnose-optimize-verify.md`
- `hooks/pre-wait-budget-check.md`

## Installation
Requires Python 3.10+ and only the standard library. Copy this package into the orchestration project and map tool/status names in `config/budget.json` to the host runtime.

## Configuration
Tune limits only from measured workloads. Keep `max_no_progress_cycles`, `max_orchestration_turns_per_child`, and `max_estimated_orchestration_tokens` finite. `authoritative_status_tools` must name the runtime APIs that actually own child lifecycle state.

## Usage
Prepare an input JSON matching the shape in `scripts/orchestration_watchdog.py`, then run:

`python scripts/orchestration_watchdog.py input.json --config config/budget.json`

Exit codes: `0` continue/collect result, `2` invalid, `3` reconcile, `4` stop/block.

## Workflow
Follow `workflows/measure-diagnose-optimize-verify.md`: measure an affected baseline first, isolate one failure mode, integrate the smallest guard, measure again, then use an independent verifier.

## Metrics
- orchestration-only model turns per task/child;
- estimated orchestration tokens per task;
- no-progress cycles;
- wrong-tool status selections;
- stale-running reconciliations;
- p50/p95 child-terminal-to-parent-recognition latency;
- child-result loss/regression rate.

## Verification
**Implemented:** watchdog, finite budgets, policy rules, baseline skill, independent verifier, workflow, and hook are included.

**Measured:** the package produces deterministic counters/decisions; production improvement must be demonstrated with baseline vs candidate traces from the target runtime.

**Verified:** success requires fewer or bounded orchestration turns/tokens plus unchanged child completion/result correctness. The implementing agent must not be the sole verifier.

## Safety and correctness
Do not kill productive child work merely to reduce tokens. A terminal event or authoritative terminal status permits direct result collection. Missing lifecycle evidence causes reconciliation, not fabricated completion. Never reset counters automatically to escape a stop condition.

## Failure handling
Detection comes from watchdog exit codes and trace metrics. Maximum optimization retries: 2 hypotheses. Fallback: stop automatic polling and return control to the coordinator/operator with exact state. Escalate when authoritative status cannot be obtained. No infinite retries.

## Definition of Done
- evidence documented;
- baseline captured;
- failure mode classified;
- finite orchestration budgets active;
- wrong-tool route detected in fixtures;
- stale terminal state reconciled;
- before/after metrics collected;
- result correctness unchanged;
- independent verification passes;
- all referenced files exist and contain no secrets.

## Customization
Integrate actual token accounting when the runtime exposes it. If only approximate token counts exist, keep estimates conservative and compare the same estimator before and after. Add event-driven wakeups when supported; retain the watchdog as a fallback for missing events.