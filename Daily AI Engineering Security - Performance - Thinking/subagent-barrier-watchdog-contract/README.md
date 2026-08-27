# Subagent Barrier Watchdog Contract

**Category:** Thinking

## Problem
Multi-agent workflows can hang because a parent waits indefinitely for a stalled child, configured timeouts are not enforced end-to-end, or cleanup blocks on an unresponsive child. The result is delayed or skipped verification and unbounded agent cost.

## Evidence
Current public evidence and source dates are documented in `evidence/research.md`.

## Existing approach
Common defenses are per-call timeouts, global workflow deadlines, polling, manual interruption, and wait-for-all barriers.

## Existing limitations
Timeouts may live inside a stalled layer; all-child barriers make one child a single point of failure; polling adds overhead; cleanup may itself hang; fixed idle timers can kill healthy long tool calls.

## Proposed improvement
Use explicit child lifecycle state, meaningful-progress heartbeats, wall and idle-progress deadlines, declared barrier semantics (`all`, `quorum`, `best-effort`), terminal timeout results, bounded recovery, bounded cleanup, and independent verification.

## Architecture
```text
subagent-barrier-watchdog-contract/
├── README.md
├── evidence/research.md
├── config/policy.json
├── scripts/barrier_watchdog.py
├── tests/test_barrier_watchdog.py
├── skills/barrier-diagnosis.md
├── rules/orchestration-stop-conditions.md
├── subagents/verification-agent.md
├── workflows/observe-recover-verify.md
└── hooks/pre-wait.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
Edit `config/policy.json` to define wall timeout, idle-progress timeout, cleanup timeout, barrier mode, minimum successes, and recovery limit.

## Usage
Create a state JSON containing `now_ms` and child records with `id`, `status`, `started_ms`, and `last_progress_ms`, then run:

`python scripts/barrier_watchdog.py --state state.json --policy config/policy.json`

## Workflow
Follow `workflows/observe-recover-verify.md`: Observe → Measure baseline → Diagnose → Form hypothesis → Recover once → Measure again → Independent verify.

## Metrics
- barrier wall time
- idle-progress violations
- stalled-child rate
- verification-stage reach rate
- recovery attempts per child
- parent duplicate-work rate

## Verification
Run `python -m unittest tests/test_barrier_watchdog.py`. Then have the independent verifier review a real child-state ledger against `rules/orchestration-stop-conditions.md`.

## Safety
The package does not grant new permissions or execute recovery actions. Dangerous/irreversible recovery always requires human approval. Failed/stalled children are never silently counted as completed evidence.

## Failure handling
**Detection:** wall/idle deadline violation or quorum unreachable.  
**Evidence:** state snapshot and watchdog JSON.  
**Retry policy:** one changed recovery attempt per child.  
**Maximum retries:** 1.  
**Fallback:** terminal stalled/failed child state and degraded verification only if policy permits.  
**Escalation:** required child/evidence unavailable or dangerous recovery needed.  
**Stop condition:** quorum achieved, quorum impossible, retry exhausted, or approval missing.

## Definition of Done
**Implemented:** watchdog, policy, hook and workflow are integrated.  
**Measured:** child timing/progress metrics and barrier decision are captured.  
**Verified:** unit tests pass; independent verifier confirms barrier semantics, required outputs and bounded loops; no blocking issue remains.

## Customization
Tune deadlines using measured workload latency, not guesswork. Add progress-event adapters for your runtime, but keep the rule that only meaningful observable task-state changes reset the idle-progress deadline.
