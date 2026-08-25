# Load Balancing and Discovery Rules

## Purpose
Route RPCs safely across changing service instances without concentrating failure.

## Scope
Name resolution, client-side balancing, proxies, health signals, locality, and endpoint lifecycle.

## MUST
- Discovery MUST remove unhealthy or retired endpoints within an understood convergence window.
- Load-balancing policy MUST match traffic shape, connection longevity, and streaming behavior.
- Endpoint changes MUST not depend on process restarts for normal convergence.
- Failover behavior MUST be tested under partial endpoint and zone failure.

## MUST NOT
- MUST NOT assume round-robin requests imply even load when streams or request costs differ materially.
- MUST NOT route privileged traffic through untrusted discovery data.
- MUST NOT treat DNS or registry presence alone as application readiness.

## SHOULD
- Prefer policies that account for locality and failure domains where latency/reliability justify them.
- Connection draining SHOULD protect in-flight work during endpoint retirement.

## Exceptions
Static endpoint configuration is acceptable only for intentionally static environments with documented operational ownership.

## Verification
Test endpoint churn, draining, unhealthy instances, zone loss, and resolver failure; inspect connection and per-endpoint load metrics.