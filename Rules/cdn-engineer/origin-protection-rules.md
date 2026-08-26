# Origin Protection Rules

## Purpose
Keep origins available and shielded from avoidable CDN bypass, miss storms, and abusive traffic.

## Scope
Applies to origin access, shielding, connection behavior, request collapsing, failover, and bypass paths.

## MUST
- Origins MUST reject unauthorized direct access where architecture permits.
- Capacity planning MUST include plausible cache-miss and cache-flush scenarios.
- Origin timeouts and connection limits MUST be explicit and compatible with application behavior.
- Cache purge or policy changes capable of causing miss storms MUST have a staged execution and rollback plan.
- Origin shielding or equivalent request consolidation MUST be evaluated for high-volume workloads.

## MUST NOT
- MUST NOT expose origin credentials or privileged headers to clients.
- MUST NOT assume normal cache hit ratio during incident capacity analysis.
- MUST NOT disable protective controls merely to restore traffic without assessing origin capacity.

## SHOULD
- Restrict origin ingress to trusted CDN identities or networks.
- Use request coalescing for expensive cache fills when supported.
- Maintain emergency rate limits and degraded-mode procedures.

## Exceptions
Direct-origin access requires a documented operational need, compensating controls, monitoring, expiry/review date, and security approval when exposure increases.

## Verification
Inspect firewall/ACL and CDN origin settings; attempt unauthorized origin access; load-test miss behavior; review origin saturation, connection, timeout, and cache-fill metrics.