# Rate Limit and Abuse Control Rules

## Purpose
Use rate controls and friction to constrain automated or high-velocity abuse while preserving legitimate burst behavior.

## Scope
Applies to quotas, throttles, velocity limits, challenge flows, cooldowns, and resource-consumption controls.

## MUST
- Rate controls MUST define the protected resource, abuse scenario, measurement window, scope key, and enforcement consequence.
- Limits MUST account for legitimate high-volume users and shared infrastructure where one identifier may represent many users.
- High-impact limits MUST include observability for triggered volume, affected cohorts, bypass attempts, and false-positive indicators.
- Limit changes MUST be tested for both abuse reduction and legitimate traffic impact before broad rollout when practical.
- Distributed enforcement MUST define consistency expectations so attackers cannot bypass controls through regions, shards, or endpoints.
- Emergency rate changes affecting production access MUST be reversible and human-approved when they materially restrict legitimate users.

## MUST NOT
- MUST NOT rely solely on IP address as actor identity when shared networks or easy rotation make that assumption unsafe.
- MUST NOT silently convert transient throttling into permanent account penalties.
- MUST NOT raise limits to solve availability symptoms when the limit is containing active abuse without documented risk review.
- MUST NOT use unexplained throttling where a safe user-facing retry or cooldown signal is feasible.

## SHOULD
- Controls SHOULD combine hard limits with adaptive friction where risk varies significantly.
- Retry guidance SHOULD avoid synchronized retry storms.
- Safety-critical mutation endpoints SHOULD use stricter controls than low-risk reads when appropriate.

## Exceptions
Incident responders MAY apply temporary coarse limits to contain an active attack. The change MUST have an owner, expiry or review point, monitoring, and rollback criteria.

## Verification
Inspect limiter configuration, scope keys, distributed consistency behavior, load tests, abuse simulations, cohort impact metrics, and incident overrides. Confirm limits fail safely and can be reverted without code changes where appropriate.