# MCP Task Polling Lifecycle Conformance Guard

**Category:** Performance  
**Research date:** 2026-08-25 (UTC+7)

## Problem
MCP 2026-07-28 Tasks formalizes long-running work around `CreateTaskResult`, `tasks/get`, `pollIntervalMs`, cancellation, and terminal states. Current conformance coverage does not exercise the client Tasks extension, while current SDK reports show automatic polling can ignore cancellation and keep polling indefinitely. This creates avoidable requests, leaked loops/resources, delayed cancellation, and inconsistent behavior across clients.

## Evidence
See `evidence/research.md`. Independent current signals include the MCP conformance gap, a TypeScript SDK cancellation leak, and active Python/TypeScript SDK Tasks implementation work.

## Existing approach and limitation
General polling helpers, backoff, wait brokers, and model-turn suppression reduce generic polling overhead, but they do not prove MCP Tasks protocol conformance: honoring server-directed `pollIntervalMs`, terminating immediately on cancellation/terminal state, bounding total poll lifetime, and treating `CreateTaskResult` consistently.

## Proposed improvement
Add a deterministic trace-level lifecycle auditor plus a reusable integration contract. Measure an existing client baseline, record task lifecycle events, enforce interval/cancellation/terminal invariants, cap polls and elapsed time, and re-run the same workload after changes. The package does not claim production performance gains without before/after telemetry.

## Architecture
```text
README.md
evidence/research.md
skills/task-poll-performance-analysis.md
rules/task-polling-contract.md
subagents/task-poll-verifier.md
workflows/measure-fix-regress.md
hooks/post-task-poll-regression.md
scripts/task_poll_audit.py
tests/test_task_poll_audit.py
```

## Installation
Python 3.10+; runtime auditor uses only the standard library.

## Trace format
JSONL records contain `task_id`, `event`, `timestamp_ms`, and optional `poll_interval_ms` / `status`.

Canonical events:
- `task.created`
- `task.poll`
- `task.cancel_requested`
- `task.terminal`

`status` terminal values: `completed`, `failed`, `cancelled`.

## Usage
`python scripts/task_poll_audit.py trace.jsonl --max-polls 100 --max-elapsed-ms 900000 --slack-ms 5`

Exit 0 = lifecycle conforms. Exit 2 = measurable lifecycle/performance violation. Exit 1 = malformed input/configuration.

## Workflow
Use `workflows/measure-fix-regress.md`: Measure → Diagnose → Hypothesize → Implement → Measure again → Independent verify. Capture the same representative Tasks workload before and after any optimization.

## Metrics
- polls/task and requests/task
- p50/p95 poll interval
- server interval violations
- polls after cancellation
- polls after terminal state
- elapsed polling lifetime
- cancellation-to-stop latency
- completion-detection latency
- leaked polling-loop count
- task lifecycle conformance pass rate

## Verification
Run `python -m unittest tests/test_task_poll_audit.py`. Then replay a representative baseline and candidate trace. A performance improvement may be claimed only when requests/task or leaked work decrease while completion correctness and accepted detection-latency SLOs do not regress.

## Safety
Cancellation and terminal states MUST never be suppressed to improve metrics. The auditor is read-only. Unknown statuses block verification. Retry loops remain bounded.

## Failure handling
Detection: interval, cancellation, terminal, poll-count, elapsed-budget, or malformed-trace violation. Retry: at most 2 implementation/test cycles. Fallback: previous bounded client behavior. Escalate when SDK semantics make cancellation or terminal ownership ambiguous. Stop after two failed cycles or any correctness regression.

## Definition of Done
**Implemented:** lifecycle tracing/auditor and host integration contract exist.  
**Measured:** representative baseline and candidate metrics are captured.  
**Verified:** unit tests pass; no poll occurs after cancellation/terminal state; configured budgets are respected; server-directed interval violations are zero; before/after evidence supports any performance claim.

## Customization
Map SDK-specific callbacks to canonical events. Adjust limits to workload SLOs but never remove poll-count and wall-clock bounds. Preserve server-directed interval semantics.