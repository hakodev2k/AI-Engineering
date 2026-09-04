# Rate Limit and Quota Rules

## Purpose
Protect shared capacity while giving consumers predictable control over request volume.

## Scope
Applies to request-rate limits, concurrency limits, quotas, burst controls, and usage ceilings.

## MUST
- Enforced limits MUST define scope, measurement unit, reset behavior, and applicable identity or tenant boundary.
- Limit-exceeded responses MUST be machine-detectable and SHOULD include safe retry guidance when applicable.
- Limits MUST account for high-cost operations separately when equal request counts do not imply equal resource consumption.
- Changes that materially reduce consumer capacity MUST follow compatibility and communication review.
- Bypass privileges MUST be restricted, auditable, and time-bounded where practical.

## MUST NOT
- Rate limits MUST NOT rely solely on undocumented behavior that consumers discover in production.
- One tenant MUST NOT be able to exhaust shared capacity without protective controls where multitenant isolation is required.
- Retry guidance MUST NOT encourage synchronized retry storms.

## SHOULD
- Limits SHOULD be based on measured capacity and abuse risk rather than arbitrary round numbers.
- Clients SHOULD receive stable usage or remaining-quota signals when operationally useful.

## Exceptions
Exceptions require capacity evidence, risk assessment, owner approval, and monitoring expectations.

## Verification
Run load and burst tests, inspect gateway configuration, validate quota isolation, review telemetry, and confirm documented limit behavior matches production enforcement.