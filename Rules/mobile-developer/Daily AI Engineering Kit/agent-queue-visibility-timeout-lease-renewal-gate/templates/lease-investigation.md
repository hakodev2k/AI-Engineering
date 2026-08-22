# Lease Investigation Record

## Trigger
Describe the duplicate-processing, timeout, lease-loss, or slow-handler symptom.

## Facts
- Queue provider:
- Ownership primitive:
- Visibility/lock timeout:
- Renewal threshold:
- Maximum lease duration:
- Handler P50/P95/P99:
- Delivery/dead-letter policy:
- Idempotency mechanism:

## Evidence
Record repository paths, configuration values, logs, metrics, test output, and provider-contract references.

## Hypotheses
For each hypothesis record confidence, affected component, evidence for/against, and validation method.

## Decision
State the smallest safe change and why alternatives were rejected.

## Verification
- Slow handler renews before expiry:
- Ownership loss blocks continued work:
- Renewal rejection blocks settlement:
- Duplicate delivery does not duplicate protected side effects:
- Build/tests pass:
- Diff contains no unrelated changes:

## Approval
List any production queue configuration change, purge, destructive replay, infrastructure change, or secret change. Record approval before execution.

## Remaining risk
Document unresolved risk and operational follow-up.
