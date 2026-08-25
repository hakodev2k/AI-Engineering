# Silent Reasoning Stall Watchdog

**Category:** Performance

## Problem
Agent turns can remain in a user-visible `Thinking` state while producing no tool call, text, or other actionable progress. Current 2026 reports show two materially different failure modes that look similar from the UI: reasoning tokens continue to accrue with almost no visible output, or the event/stream path silently stalls for minutes or hours. A plain wall-clock timeout cannot distinguish them and a token cap alone reacts too late.

## Evidence
See `evidence/research.md`. Current evidence includes Codex Desktop stalls reported on 2026-08-21 and Claude Code silent/infinite-thinking reports from 2026-07-31 through 2026-08-16.

## Existing approach and limitation
Current mitigations are manual interrupt/retry, generic request timeouts, provider `max_tokens`, UI spinners/token counters, and broad task spend caps. These controls do not classify whether the turn is compute-active but progress-silent, transport-silent, or merely missing a readable reasoning summary.

## Proposed improvement
Record a stream-normalized event ledger and evaluate it with `scripts/stall_watchdog.py`. The watchdog uses independently observable signals: wall-clock event age, last visible-progress age, cumulative token deltas, terminal events, and tool/text events. It never requests hidden chain-of-thought.

## Architecture
```text
silent-reasoning-stall-watchdog/
├── README.md
├── evidence/research.md
├── hooks/progress-watchdog.md
├── rules/stall-budget-rules.md
├── scripts/stall_watchdog.py
├── skills/diagnose-silent-stalls.md
├── subagents/performance-investigator.md
├── tests/test_stall_watchdog.py
└── workflows/measure-diagnose-recover.md
```

## Installation
Python 3.10+; no third-party dependency.

## Usage
```bash
python scripts/stall_watchdog.py trace.jsonl --now 2026-08-25T14:02:00Z --silent-seconds 60 --token-delta 5000
```
Exit codes: `0=healthy/terminal`, `10=progress-silent token burn`, `11=event-stream stall`, `12=invalid evidence`.

## Workflow
Follow `workflows/measure-diagnose-recover.md`: establish a baseline, classify the stall, form one hypothesis, change only the relevant mechanism, rerun the same workload, and verify independently.

## Metrics
p50/p95 time to first visible progress, p95 maximum visible-progress gap, silent tokens/affected turn, stalled-turn rate, false-cancel rate, mean time to recovery.

## Verification
`python -m unittest tests/test_stall_watchdog.py` MUST pass. Production verification additionally requires before/after traces from the same workload and adapter.

## Safety
The watchdog reads telemetry only. It MUST NOT inspect or expose private reasoning content. Cancellation must preserve side-effect reconciliation if a tool may still be running.

## Failure handling
Malformed/non-monotonic evidence returns exit 12; do not infer a stall. At most two automated recovery attempts are allowed, then preserve the trace and escalate.

## Definition of Done
**Implemented:** event normalization and watchdog integrated. **Measured:** baseline and post-change traces exist. **Verified:** stall rate or silent-token burn improves without exceeding the false-cancel budget, tests pass, and no safety/context boundary is weakened.
