# Rate Limiting and Quotas

## Purpose
Protect shared capacity while preserving predictable consumer behavior.

## Scope
Rate limits, concurrency limits, quotas, burst policy, and overload responses.

## MUST
- Limits MUST be tied to measurable capacity, abuse risk, or product policy.
- Limit keys and scopes MUST prevent one tenant from exhausting another tenant's allocation.
- Rejection responses MUST be deterministic and document retry guidance when safe.
- Changes that materially reduce consumer capacity MUST be reviewed and communicated.

## MUST NOT
- MUST NOT use unbounded queues as a substitute for admission control.
- MUST NOT silently throttle successful-looking requests.

## SHOULD
- Limits SHOULD expose telemetry for saturation, rejection, and top consumers.

## Exceptions
Temporary overrides require expiry, capacity evidence, and accountable approval.

## Verification
Load-test boundaries, inspect configuration, verify isolation, and review rejection metrics.