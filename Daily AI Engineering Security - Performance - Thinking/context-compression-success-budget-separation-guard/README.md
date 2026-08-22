# Context Compression Success Budget Separation Guard

## Category
Performance

## Problem
Long agent turns may legitimately require several maintenance compactions as tools add new context. If one shared attempt counter is used for both successful maintenance and failed/no-progress recovery, productive compactions can consume the same budget intended to prevent retry thrash. Later context growth can then cause a false terminal failure even though compression still works.

## Evidence
See `evidence/research.md`. The package is grounded in current 2026 reports from Hermes Agent, OpenAI Codex, and Claude Code showing shared compression-counter ambiguity, retry exhaustion, and costly compaction loops.

## Existing approach
Common implementations use a single `max_attempts` counter, percentage reduction gates, per-turn resets, remote retry budgets, and manual new-session recovery.

## Existing limitations
A shared lifetime counter conflates productive maintenance with failed retry protection. Resetting it indiscriminately can instead create infinite loops. Compressor return is also insufficient proof of success unless context pressure materially falls and the next model request succeeds.

## Proposed improvement
Separate: (1) consecutive failed/no-progress attempts, (2) reactive retries scoped to one provider error, and (3) total compression events. Verified maintenance can reset the failure streak only after material reduction and successful model continuation. A separate high absolute cap remains as the final safety bound.

## Architecture
The host emits compression/model-result events. `scripts/compression_budget_guard.py` reconstructs the state machine under `config/policy.json`. The hook is placed after compression and post-compression model continuation. Unit tests cover productive and pathological trajectories; an independent benchmark reviewer verifies measured improvement.

## Package tree
```text
context-compression-success-budget-separation-guard/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── post-compression-budget-check.md
├── rules/
│   └── compression-budget-rules.md
├── scripts/
│   └── compression_budget_guard.py
├── skills/
│   └── compression-budget-analysis.md
├── subagents/
│   └── benchmark-reviewer.md
├── tests/
│   └── test_compression_budget_guard.py
└── workflows/
    └── measure-separate-verify.md
```

## Installation
Python 3.10+; standard library only. Copy the package intact.

## Configuration
Tune `minimum_progress_ratio`, failure/retry bounds, and the absolute total-event cap using measured workloads. Do not set any bound to unlimited. Keep post-compression model-success verification enabled when the runtime can observe it.

## Usage
Write JSONL events and run:

`python scripts/compression_budget_guard.py events.jsonl --policy config/policy.json`

Exit `0` means the trajectory remains within budget; `3` means stop/handoff; `2` means invalid telemetry/configuration.

## Workflow
Use `workflows/measure-separate-verify.md`: Measure → Diagnose → Hypothesize → Implement → Measure again → bounded re-evaluation → independent verification.

## Metrics
- False terminal failures after verified maintenance.
- Context-overflow recovery rate.
- Failed compression model calls/tokens.
- No-progress attempts before termination.
- Reactive retries per provider error.
- Productive maintenance cycles sustained.
- Added latency per recovery.

## Verification
Run:

`python -m unittest tests/test_compression_budget_guard.py`

Then replay the same host-specific benchmark workload before and after the change. Do not claim improvement from unit tests alone.

## Safety
The package does not advocate unlimited compaction. Consecutive failed/no-progress retries, reactive error retries, and total compression events all remain bounded. Context needed for correctness must not be discarded merely to hit a performance target.

## Failure handling
**Detection:** repeated no-progress compression, reactive retry exhaustion, unreliable pressure telemetry, absolute cap reached, or false terminal failure after verified maintenance.

**Evidence:** redacted compression/model event trace, policy version, token measurements, provider error class, benchmark result.

**Retry policy:** maximum 2 diagnose/implement/benchmark cycles for the same hypothesis.

**Fallback:** preserve stricter current bounds and perform a controlled new-turn/session handoff if available.

**Escalation:** agent runtime/context-management owner.

**Stop condition:** stop after two unsuccessful cycles, when measurement cannot be trusted, or when the proposed optimization would require removing hard safety bounds.

## Definition of Done
### Implemented
Maintenance, failure streak, reactive retry, and absolute cap semantics are explicit in the runtime.

### Measured
Baseline and post-change results use the same workloads and measurement method.

### Verified
Four or more successful maintenance cycles can continue in the long fixture; repeated no-progress compression stops at the configured failure limit; reactive retries stop at their per-error bound; the absolute cap still stops/handoffs pathological turns; tests and independent review pass.

## Customization
Map the event schema to the host runtime. If actual token counts are unavailable, use a stable estimator and label the measurement as estimated. Threshold changes should be evidence-driven and benchmarked against both productive and pathological traces.
