# Workflow: Measure → Diagnose → Break → Verify

## Trigger
Repeated MCP method failure, elevated idle request rate, or elevated idle CPU/I/O.

## Goal
Stop semantically invalid retries while preserving bounded recovery for transient failures.

## Inputs
Retry trace, capability metadata, resource baseline, server identity/version.

## Baseline
Capture one minute of idle CPU, I/O, requests/minute, errors/minute, and current retry counts.

## Stages
1. Observe and capture baseline.
2. Classify each distinct server/method failure.
3. Form hypothesis about terminal vs transient behavior.
4. Apply capability-state/circuit-breaker policy.
5. Replay controlled failures.
6. Measure one minute of post-change idle behavior.
7. Independent Retry Auditor verifies convergence.

## Responsible agent
Host implements; Retry Auditor verifies independently.

## Tools
`scripts/retry_trace_analyzer.py`, structured MCP logs, process/resource sampler.

## Outputs
Before/after metrics, classification report, breaker state, regression result.

## Checkpoints
No policy change without baseline; no completion without replay tests and idle measurement.

## Metrics
Requests/minute, errors/minute, attempts/key, CPU%, bytes read/write, WAL/log writes, time-to-quiescence.

## Retry policy
Implementation/diagnostic loop maximum 2 iterations. Transient operation retry maximum 4 attempts.

## Stop conditions
Stop if capability identity is ambiguous, required capability would be suppressed, or two implementation cycles fail to reduce retry rate.

## Failure path
Restore previous policy, preserve diagnostics, disable only the faulty optional refresh path if safe and explicitly configured, then escalate to operator/maintainer.

## Verification
Terminal unsupported replay must produce exactly one call per capability epoch. Transient replay must follow bounded backoff and recover when a later attempt succeeds.

## Definition of Done
Idle request/error rate converges, resource usage improves against baseline, no required capability is suppressed, tests pass, and independent audit returns PASS.