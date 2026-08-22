# Agent Tool Stall Watchdog

**Category:** Performance

## Problem
Headless and scheduled agents can become silent for minutes or hours while a tool, deferred-tool transition, hook, network operation, or internal retry path blocks. A single outer process timeout catches the problem late and wastes most of the job's wall-clock budget.

## Evidence
See `evidence/research.md`. Current signals include Claude Code issues #83859, #34565, #33073, and #60224. The package does not claim those issues share one root cause; they support the recurring engineering need for bounded liveness and diagnostics.

## Existing approach
Global subprocess/CI timeout, manually increasing timeout, or waiting for a human to kill a hung process.

## Existing limitations
Those controls detect too late, lack stage-aware diagnostics, and often encourage blind retries or ever-larger timeouts.

## Proposed improvement
Wrap the agent process with a monotonic liveness watchdog that tracks output/heartbeat activity, enforces both global and silence deadlines, captures bounded diagnostics before termination, and leaves retry decisions to an explicit idempotency-aware policy.

## Architecture
```text
scheduled runner
  -> pre-run validation
  -> stall_watchdog.py
  -> child agent process
       -> stdout/stderr/heartbeat -> last_activity
  -> silence exceeded?
       no  -> continue
       yes -> record diagnostics -> graceful terminate -> hard kill if needed
  -> safe/idempotent + budget remains?
       yes -> bounded external retry
       no  -> stop/escalate
```

## Package tree
```text
agent-tool-stall-watchdog/
├── README.md
├── evidence/research.md
├── skills/diagnose-and-bound-stalls.md
├── rules/stall-control-rules.md
├── subagents/stall-investigator.md
├── workflows/watch-run-recover.md
├── hooks/pre-run.md
├── scripts/stall_watchdog.py
└── tests/test_stall_watchdog.py
```

## Installation
Requires Python 3.10+. Copy the package into the automation runner repository. Keep the platform/CI timeout enabled as an independent final limit.

## Configuration
Choose thresholds from measured healthy runs. Example for a job normally completing in six minutes with frequent tool events:
- platform timeout: 15 min;
- watchdog global timeout: 10 min;
- silence timeout: start above measured healthy p99, for example 90 s;
- graceful termination: 5 s;
- automatic retry: disabled unless the entire run is known idempotent.

## Usage
```bash
python scripts/stall_watchdog.py \
  --global-timeout 600 \
  --silence-timeout 90 \
  --grace 5 \
  --record .agent-state/run-001.json \
  -- claude -p --output-format text "task"
```

Exit codes:
- child exit code: normal completion;
- `124`: global timeout;
- `125`: silence timeout;
- `126`: watchdog/configuration failure.

The script intentionally does not retry. The parent workflow decides whether retry is safe.

## Workflow
Follow `workflows/watch-run-recover.md`. Use `subagents/stall-investigator.md` to analyze repeated signatures rather than guessing upstream root cause.

## Metrics
Track p50/p95/p99 runtime and silence, early termination savings, repeated stalls by stage/tool/version, safe recovery rate, false-positive terminations, and orphan processes.

## Verification
Run:
```bash
python -m unittest tests/test_stall_watchdog.py
```
Then replay a representative headless command and inject a controlled silent child to verify the watchdog terminates before the platform timeout and writes the diagnostic record.

## Safety
Do not automatically retry unknown or side-effecting operations. Termination can interrupt a tool between output and persistence, so downstream workflows must independently verify side effects before declaring success or retrying.

## Failure handling
If the watchdog cannot launch, observe, record, or terminate reliably, return `126` and rely on the outer platform timeout. Repeated same-stage stalls should stop after the configured retry bound and be escalated with collected telemetry.

## Definition of Done
- healthy baseline measured;
- explicit global/silence deadlines configured;
- diagnostics captured before termination;
- silent child terminated within threshold plus grace;
- retries remain bounded and idempotency-aware;
- tests pass;
- before/after wasted wall-clock time measured;
- upstream root cause is not claimed without evidence.

## Customization
Add structured JSON event parsing, per-stage thresholds, Windows Job Objects, container cancellation, OpenTelemetry spans, alerting, or a retry controller while preserving the monotonic global budget and no-blind-retry rules.