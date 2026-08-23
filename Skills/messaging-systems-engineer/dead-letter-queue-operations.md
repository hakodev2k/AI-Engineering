# Dead-Letter Queue Operations

## Purpose
Design DLQs as recoverable operational workflows rather than message graveyards.

## When to use
Use when messages can exhaust retries or become unprocessable.

## Inputs
Failure categories, retry policy, payload sensitivity, ownership and recovery requirements.

## Context to inspect
DLQ configuration, retention, alerts, tooling, access controls and replay paths.

## Core knowledge
A DLQ preserves failed work for diagnosis and controlled remediation; replay without fixing cause can recreate incidents.

## Procedure
1. Define reasons messages enter DLQ.
2. Preserve diagnostic metadata safely.
3. Set retention and access policy.
4. Alert on meaningful rates/backlogs.
5. Create inspect, quarantine, repair and replay procedures.
6. Require idempotent replay.
7. Track disposition and root cause.

## Decision points
Replay automatically only for proven transient classes; require review for data, schema or business-rule failures.

## Common failure patterns
No owner, blind bulk replay, sensitive payload exposure and monitoring only queue depth.

## Verification
Exercise poison messages and recovery drills; prove operators can diagnose and replay safely.

## Expected output
An owned DLQ lifecycle with runbooks and controls.

## Stop conditions
Escalate replay when root cause is unresolved or side effects cannot be safely repeated.