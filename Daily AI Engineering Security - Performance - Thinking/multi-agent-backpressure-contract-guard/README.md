# Multi-Agent Backpressure Contract Guard

**Category:** Performance

## Problem
Retrying a saturated downstream agent/tool can amplify load: retries create more work, queues grow, latency rises, and additional retries follow. Capacity knowledge is often duplicated across callers rather than owned by the provider.

## Evidence
See `evidence/research.md`. Current AutoGen reports explicitly describe missing capacity contracts and cascading retries; current agent frameworks expose retry/timeout/iteration mechanisms but still require application-level composition for provider-aware backpressure.

## Existing approach
Per-caller retry/backoff, circuit breakers, semaphores, queue limits, and framework iteration limits.

## Existing limitations
They are frequently configured independently, can drift from provider capacity, and may not combine queue age, logical-task retries, calls, tokens, and deadlines into one admission decision.

## Proposed improvement
A provider-owned capacity policy plus deterministic pre-dispatch guard producing `allow`, `delay`, `shed`, or `stop`.

## Package tree
```text
README.md
evidence/research.md
config/capacity-policy.json
rules/backpressure-rules.md
skills/backpressure-diagnosis.md
subagents/performance-investigator.md
workflows/measure-diagnose-optimize.md
hooks/pre-dispatch-check.md
scripts/backpressure_guard.py
tests/test_backpressure_guard.py
```

## Installation
Python 3.10+ is sufficient for the guard. Tests use only the standard library.

## Configuration
Edit `config/capacity-policy.json` using measured provider capacity. Do not copy defaults into production without a benchmark.

## Usage
Create `request.json` with runtime counters, then run:

```bash
python scripts/backpressure_guard.py request.json --policy config/capacity-policy.json
```

Exit codes: `0` allow, `2` invalid, `3` delay, `4` shed/stop.

## Workflow
Follow `workflows/measure-diagnose-optimize.md`: Observe → baseline → diagnose → one hypothesis → policy change → measure again → independent verification.

## Metrics
Latency percentiles, throughput, queue depth/age, retries/task, calls/task, tokens/task, timeout rate, shed rate.

## Verification
Run deterministic tests and an equivalent-load benchmark. A performance improvement is not verified until target metrics improve without a correctness/security regression.

## Safety
The guard never authorizes a capability; it only constrains dispatch. Authentication, authorization, input validation, and human approvals remain mandatory.

## Failure handling
Invalid policy blocks dispatch. Permanent errors stop immediately. Retry exhaustion, deadline expiration, queue age overflow, and task budget exhaustion stop further attempts. Tuning is bounded to two attempts per hypothesis.

## Definition of Done
- **Implemented:** guard, policy, hook, workflow, and rules are integrated.
- **Measured:** pre/post metrics use equivalent workload.
- **Verified:** target latency/call/token improvement is reproduced; no correctness/security regression; retry and queue loops remain bounded.

## Customization
Add dependency-specific capacity profiles or export the guard decision as OpenTelemetry attributes, but keep the provider-owned limits and bounded-stop semantics intact.
