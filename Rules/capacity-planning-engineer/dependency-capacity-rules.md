# Dependency Capacity Rules
## Purpose
Prevent local scaling from overwhelming shared or external dependencies.
## Scope
Databases, caches, queues, APIs, identity systems, third-party services, and shared platforms.
## MUST
- Capacity plans MUST map critical downstream dependencies and their quotas or throughput limits.
- Fan-out, retries, batching, and cache-miss amplification MUST be represented in dependency demand.
- Shared dependency plans MUST account for aggregate demand from all significant consumers.
## MUST NOT
- MUST NOT approve upstream capacity expansion without checking downstream limits.
- MUST NOT assume vendor quotas can be raised instantly.
## SHOULD
- Critical external limits SHOULD have documented escalation and lead-time assumptions.
## Exceptions
Unknown external capacity requires conservative bounds and risk escalation.
## Verification
Inspect dependency maps, quota dashboards, contracts, telemetry, and load tests.