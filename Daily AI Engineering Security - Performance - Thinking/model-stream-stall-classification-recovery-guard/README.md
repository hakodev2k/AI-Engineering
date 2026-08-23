# Model Stream Stall Classification & Recovery Guard

**Category:** Performance

## Problem
Long-running AI subagents can be killed by fixed model-stream watchdogs even when the request is merely slow, while genuinely dead TCP/model streams can remain silent for minutes. Treating both conditions as the same generic `stalled` state causes false termination, repeated work, leaked child processes, and avoidable token/latency cost.

## Evidence
Current August 2026 Claude Code reports show (a) healthy high-effort/large-context requests reaching the fixed 600-second boundary and completing when resumed, and (b) dead or disconnected streams that should be retried sooner. See `evidence/research.md`.

## Existing approach and limitation
A fixed idle timeout is deterministic but cannot distinguish long time-to-first-token, upstream queueing, dead transport, active retry/backoff, and true agent deadlock. Raising the timeout hides dead streams; lowering it kills healthy slow work.

## Proposed improvement
Instrument model-stream phases and classify a suspected stall using observable transport/model signals before cancellation. Apply bounded recovery: preserve side-effect state, attempt one idempotent resume/retry, optionally route to an equivalent fallback model, then stop and escalate with evidence.

## Package tree
- `evidence/research.md` — current public evidence and root cause.
- `skills/stall-classification.md` — evidence-driven diagnostic procedure.
- `rules/stall-recovery-rules.md` — enforceable runtime rules.
- `subagents/stream-reliability-reviewer.md` — independent review role.
- `workflows/measure-classify-recover.md` — bounded workflow.
- `hooks/pre-cancel-stall-gate.md` — deterministic pre-cancel hook contract.
- `scripts/stall_trace_analyzer.py` — JSONL trace analyzer.
- `tests/test_stall_trace_analyzer.py` — executable unit tests.

## Installation
Python 3.10+; no third-party packages.

## Usage
`python scripts/stall_trace_analyzer.py trace.jsonl --timeout-ms 600000 --json`

Input JSONL accepts timestamped events with `kind` values such as `tool_result`, `stream_chunk`, `retry_start`, `retry_end`, `transport_error`, `request_end`, and `watchdog_abort`.

## Metrics
Measure p50/p95/p99 TTFT, fixed-boundary abort count, resumable-abort rate, dead-stream detection latency, recovery success rate, duplicated model/tool work, and tokens re-paid after recovery.

## Verification
Run `python -m unittest discover -s tests -p 'test_*.py'`. A production integration is **Verified** only when it reduces false watchdog aborts without increasing unrecovered dead-stream time beyond the configured SLO and without replaying unsafe side effects.

## Safety
The guard never interprets silence as permission to repeat a state-changing tool. Recovery is model-request scoped; external side effects require idempotency evidence or human approval.

## Failure handling
Maximum one automatic recovery attempt per stall episode. If classification remains ambiguous or the retry fails, stop the child, preserve trace/checkpoint evidence, and escalate.

## Definition of Done
Evidence documented; baseline measured; classifier installed; pre-cancel gate active; tests pass; before/after metrics collected; false-positive and dead-stream cases independently verified; no unbounded retry exists.