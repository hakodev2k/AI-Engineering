# DNS Dependency Rules

## Purpose
Keep name resolution reliable and prevent DNS behavior from undermining routing or failover.

## Scope
Authoritative records, resolver dependencies, TTLs, aliases, service discovery, and DNS-based traffic management.

## MUST
- DNS dependencies in the traffic path MUST have explicit ownership and availability expectations.
- TTL values MUST reflect the required balance between caching efficiency and change/failover responsiveness.
- DNS changes MUST be validated for record correctness, delegation, propagation expectations, and rollback.
- Resolver failure behavior and caching MUST be considered in incident and failover design.
- Critical records MUST be monitored from independent vantage points where practical.

## MUST NOT
- MUST NOT use extremely low TTLs as a substitute for tested failover design.
- MUST NOT delete or replace production records without verifying dependent names and rollback options.
- MUST NOT assume all clients honor TTLs identically.

## SHOULD
- Minimize unnecessary CNAME/alias chains in latency-sensitive paths.
- Use staged DNS migrations when record semantics change.

## Exceptions
Emergency record changes require incident authority, recorded rationale, and post-change validation.

## Verification
Inspect authoritative responses, delegation, TTLs, resolver behavior, propagation, monitoring probes, and rollback readiness.