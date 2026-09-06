# Stream Semantic Progress Watchdog

**Category:** Performance  
**Run date:** 2026-09-07 (Vietnam time)

## Problem
Long-running AI agent streams can stay transport-active while making no useful task progress: heartbeat/ping/control events continue, malformed/empty chunks repeat, or a provider stalls after a partial response. If orchestration resets its timeout on every event, liveness traffic can suppress recovery indefinitely. If it retries too aggressively, it creates duplicate model/tool work, extra cost, and long tail latency.

## Evidence
Current SDK/agent issue reports continue to show streaming hangs and long-tail completion failures, while production guidance distinguishes connection/read timeouts from end-to-end deadlines. See `evidence/research.md`.

## Existing approach
HTTP read timeouts, provider SDK retries, heartbeats, generic inactivity timers, and application-level task deadlines.

## Existing limitations
Transport activity is not semantic progress. A heartbeat can keep a read timeout alive; a generic retry can duplicate expensive work; a single total timeout cannot distinguish slow-but-progressing responses from streams that are alive but stuck.

## Proposed improvement
Instrument the event stream with a deterministic semantic-progress classifier and two clocks: `last_transport_activity` and `last_semantic_progress`. Trigger bounded recovery when semantic progress exceeds its budget even if transport traffic continues. Preserve an overall task deadline and an idempotency/retry budget.

## Architecture
```text
stream-semantic-progress-watchdog/
├── README.md
├── config/watchdog.json
├── evidence/research.md
├── hooks/post-stream-event-check.md
├── rules/stream-liveness-rules.md
├── scripts/semantic_progress_watchdog.py
├── skills/stream-stall-investigation.md
├── subagents/performance-verifier.md
├── tests/test_semantic_progress_watchdog.py
└── workflows/measure-diagnose-recover.md
```

## Installation
Python 3.10+, standard library only.

## Usage
Feed JSONL event traces into the watchdog:
```bash
python scripts/semantic_progress_watchdog.py trace.jsonl --semantic-timeout-ms 30000 --overall-timeout-ms 300000
python -m unittest tests/test_semantic_progress_watchdog.py
```

## Event contract
Each JSON line requires monotonic `ts_ms` and `kind`. Semantic kinds default to `text_delta`, `tool_call`, `tool_result`, `completion`; transport-only examples include `heartbeat`, `ping`, and `metadata`.

## Workflow
Measure baseline p50/p95/p99 task duration and retry/tool/model-call counts → classify stalls → test hypothesis → enable semantic watchdog → measure again → independently verify no quality regression or retry amplification.

## Metrics
Task latency p50/p95/p99, semantic-stall count, transport-idle count, model/tool calls per task, retry count, recovery success, duplicate side effects, and completed-task rate.

## Verification
A heartbeat-only stream must trip semantic timeout; a progressing stream must not; overall deadline must still win; timestamps must be monotonic; recovery attempts are bounded.

## Safety
The watchdog diagnoses/recommends recovery; callers MUST NOT automatically replay non-idempotent tool calls. Human approval remains required for dangerous or irreversible actions.

## Failure handling
At most two recovery attempts per task. If semantic progress is not restored, stop and surface evidence. Never extend deadlines merely to make metrics appear successful.

## Definition of Done
**Implemented:** classifier/watchdog exists. **Measured:** before/after latency and call-count baselines captured in deployment. **Verified:** deterministic tests pass and production rollout demonstrates fewer stuck tasks without increased duplicate effects or quality regression.