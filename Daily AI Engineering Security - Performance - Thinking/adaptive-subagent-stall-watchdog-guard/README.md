# Adaptive Subagent Stall Watchdog Guard

**Category:** Performance

## Problem
A fixed 600-second silence timer can misclassify slow-but-healthy long-context/model work as dead. August 2026 reports show repeated sharp timeout signatures, recoverable tasks, and costly retry amplification.

## Evidence
See `evidence/research.md` for dated public reports and existing approaches.

## Existing limitation
A single timeout scalar cannot distinguish model tail latency, transport failure, recent semantic progress, or a true wedge. Raising it globally slows recovery; lowering it increases false kills.

## Proposed improvement
Calibrate observed tail latency, combine time with transport/progress/retry evidence, and use bounded adaptive grace plus an immutable hard ceiling.

## Architecture
```
README.md
evidence/research.md
scripts/watchdog_decision.py
scripts/calibrate_gaps.py
tests/test_watchdog.py
rules/stall-watchdog-rules.md
skills/stall-latency-investigation.md
subagents/watchdog-verifier.md
workflows/measure-calibrate-deploy-verify.md
hooks/pre-abort-liveness-check.md
```

## Installation
Python 3.9+; standard library only.

## Configuration
Choose cohorts by model/effort/context characteristics. Export CSV with a `gap_s` column. Set a finite `hard_ceiling_s` from operational SLOs; it must exceed the normal adaptive envelope but remain bounded.

## Usage
`python3 scripts/calibrate_gaps.py gaps.csv`

Pass observation JSON to `python3 scripts/watchdog_decision.py observation.json`.

Run `python3 -m unittest tests/test_watchdog.py`.

## Workflow
Use `workflows/measure-calibrate-deploy-verify.md`; integrate `hooks/pre-abort-liveness-check.md` before destructive timeout handling.

## Metrics
False-abort rate, true-stall detection latency, p99 gap, completion without restart, retries/task, repeated token/tool-call cost, throughput.

## Verification
**Implemented:** decision layer integrated. **Measured:** representative before/after workload captured. **Verified:** independent verifier confirms fewer false aborts with bounded true-stall detection and all tests passing.

## Safety
The guard does not grant extra permissions or defeat explicit user cancellation. Hard ceilings and retry budgets are mandatory. Security and approval boundaries take precedence.

## Failure handling
Detection: abort clusters or replay mismatch. Evidence: timestamped events and policy output. Retry: maximum two revisions. Fallback: retain existing safe policy. Escalation: runtime/provider owner. Stop if trade-offs cannot meet both completion and detection bounds.

## Definition of Done
Current evidence documented; baseline measured; root cause classified; policy implemented; tests pass; before/after metrics complete; hard ceiling/retry bound verified; independent verification complete; no blocking issue remains.
