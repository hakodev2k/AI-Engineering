# Rate Limiting and Abuse Rules

## Purpose
Protect APIs and dependent systems from automated abuse and resource exhaustion.

## Scope
Rate limits, quotas, concurrency limits, expensive operations, scraping, enumeration, and denial-of-service controls.

## MUST
- Define limits using measured capacity, abuse scenarios, consumer identity, and business criticality.
- Bound expensive operations independently when request count alone does not represent cost.
- Return controlled failure behavior when limits are exceeded.
- Monitor repeated limit violations and anomalous consumption patterns.

## MUST NOT
- Depend on a single global request limit when endpoints have materially different costs or risks.
- Allow unbounded pagination, batch size, upload size, or fan-out.

## SHOULD
- Use layered controls at gateway and application/resource boundaries where appropriate.

## Exceptions
Higher limits require justified need, capacity evidence, scoped identity, monitoring, and approval.

## Verification
Load-test limits, simulate abuse, inspect gateway/application configuration, and review metrics for bypass paths.