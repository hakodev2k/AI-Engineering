# Dependency Failure Rules

## Purpose
Manage incidents caused or amplified by external and internal dependencies without creating uncontrolled cascading failures.

## Scope
APIs, databases, queues, identity providers, cloud services, networks, third-party vendors, and shared platforms.

## MUST
- Confirm dependency health using both local symptoms and dependency-side evidence where available.
- Bound retries, concurrency, queue growth, and timeouts to prevent retry storms and resource exhaustion.
- Evaluate graceful degradation, traffic shedding, cached behavior, or circuit breaking against correctness and safety requirements.
- Track dependency recovery separately from local recovery and verify reintegration.

## MUST NOT
- Increase retries or timeouts broadly without modeling load and failure amplification.
- Attribute an incident to a dependency solely because a downstream call failed.

## SHOULD
- Maintain known dependency owners, escalation paths, quotas, limits, and fallback behavior for critical paths.

## Exceptions
Emergency isolation may intentionally reduce functionality when it materially protects core service or data integrity.

## Verification
Review dependency telemetry, request rates, retry behavior, saturation, vendor evidence, fallback activation, and reintegration tests.