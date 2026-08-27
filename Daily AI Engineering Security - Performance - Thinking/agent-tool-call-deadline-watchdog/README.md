# Agent Tool-Call Deadline Watchdog

**Category:** Performance

## Problem
A single agent tool call can remain in flight for minutes or indefinitely when deadlines differ by execution path or are optional, while orchestrators may lack enough telemetry to distinguish healthy work from a stall.

## Evidence
See `evidence/research.md` for current August 2026 signals from Prime Agent and Hermes Agent.

## Existing approach
Per-tool timeout flags, parallel executor timeouts, process restarts, generic retries, and coarse tool-state polling.

## Existing limitations
Coverage is inconsistent across sequential/parallel paths; validation failures can wait too long; coarse status omits elapsed/deadline data; unsafe retries can duplicate side effects.

## Proposed improvement
A centralized deadline-and-retry contract with pre-dispatch validation, monotonic timing, explicit side-effect/idempotency metadata, deterministic stall classification, bounded safe retry, and independent verification.

## Architecture
```text
agent-tool-call-deadline-watchdog/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-dispatch-and-stall-check.md
├── rules/deadline-and-retry.md
├── scripts/tool_watchdog.py
├── skills/tool-stall-investigation.md
├── subagents/performance-verifier.md
├── tests/test_tool_watchdog.py
└── workflows/
    ├── failure-recovery.md
    └── measure-diagnose-optimize.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
Tune deadline classes in `config/policy.json` using measured p95/p99 latency. Do not increase deadlines simply to suppress failures.

## Usage
Create an event JSON with call lifecycle metadata, then run:
`python scripts/tool_watchdog.py --event event.json --policy config/policy.json`

## Workflow
Use `workflows/measure-diagnose-optimize.md` for normal optimization and `workflows/failure-recovery.md` when a call cannot be safely retried.

## Metrics
p95/p99 tool latency; stale-call rate; mean recovery time; retries per call; duplicate-side-effect count.

## Verification
Run `python -m unittest tests/test_tool_watchdog.py`. The verifier must also reproduce one stale read fixture and one consequential-call fixture.

## Safety
Consequential or unknown-side-effect calls never auto-retry. Secrets are excluded from logs. Ambiguous recovery fails closed to escalation.

## Failure handling
Detection: watchdog non-zero decision. Evidence: call metadata and reason. Runtime retry maximum follows policy and is never unbounded. Fallback: cancel/disable affected binding where supported. Escalation: operator review for side-effect ambiguity. Stop on exhausted wall-clock budget or possible duplicate write.

## Definition of Done
- **Implemented:** all call paths emit required metadata and invoke the watchdog.
- **Measured:** baseline and after metrics are captured on the same fixture set.
- **Verified:** tests pass, stale calls are bounded, healthy calls remain within agreed regression tolerance, and no consequential call is auto-retried.

## Customization
Add tool-specific deadline classes only when supported by production latency evidence; preserve the global attempt and wall-clock bounds.
