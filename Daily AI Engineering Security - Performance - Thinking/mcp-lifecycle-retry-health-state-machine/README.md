# MCP Lifecycle Retry and Health State Machine
**Category:** Performance

## Problem
MCP clients can convert a transient initialization failure or a stale local process handle into a session-long outage, even when the remote endpoint or stdio server is healthy.

## Evidence
See `evidence/research.md`: recent Copilot CLI and Hermes issues independently report transient/incorrect lifecycle failures that remove usable MCP tools.

## Existing approach
Many clients perform one initialization sequence, apply a generic timeout, and cache a failed state for the session.

## Existing limitations
One-shot initialization confuses transient transport errors with protocol incompatibility. A stale process-handle observation can be treated as proof that the server is dead. Unbounded retries would be worse, so recovery needs a bounded evidence-based state machine.

## Proposed improvement
Classify lifecycle failures, probe health before declaring permanent failure, retry only transient classes with capped exponential backoff, and preserve a separate `degraded` state before terminal `failed`.

## Package tree
- `config/policy.json`
- `evidence/research.md`
- `skills/lifecycle-diagnosis.md`
- `rules/retry-and-health.md`
- `subagents/performance-investigator.md`
- `workflows/measure-diagnose-optimize.md`
- `workflows/regression-verification.md`
- `hooks/post-lifecycle-event.md`
- `scripts/lifecycle_guard.py`
- `tests/test_lifecycle_guard.py`

## Installation
Python 3.10+, standard library only.

## Usage
`python scripts/lifecycle_guard.py --event lifecycle-event.json --policy config/policy.json`

## Metrics
Initialization success rate, recovery rate after transient errors, session-long false-failure rate, retries/task, p50/p95 time-to-ready, tool-call availability, retry amplification.

## Verification
`python -m unittest tests/test_lifecycle_guard.py`

## Safety
No infinite retries. Permanent authentication/protocol errors fail immediately. High-risk tools are not auto-approved by this package.

## Failure handling
Maximum retries are policy-bounded. Fallback is `degraded` plus explicit server unavailability. Escalate persistent health mismatch or protocol incompatibility.

## Definition of Done
**Implemented:** classified lifecycle state machine integrated.  
**Measured:** before/after initialization and recovery metrics collected.  
**Verified:** transient fixtures recover within bounds, permanent errors fail fast, retry amplification remains under configured limits.
