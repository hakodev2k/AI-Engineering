# Load Balancing Rules

## Purpose
Ensure cloud traffic distribution is reliable, secure, observable, and capacity-aware.

## Scope
Applies to Layer 4/7 load balancers, health probes, listeners, backend pools, failover, and traffic policies.

## MUST
- Health checks MUST test meaningful service readiness rather than process existence alone.
- Listener, protocol, timeout, and backend settings MUST match application behavior and failure semantics.
- Load balancer changes MUST include capacity, draining, failover, and rollback analysis.
- Internet-facing listeners MUST enforce approved TLS and access controls.
- Cross-zone or cross-region behavior MUST be explicitly understood before enabling it.

## MUST NOT
- MUST NOT route traffic to unhealthy backends intentionally without documented emergency approval.
- MUST NOT disable certificate validation or secure transport to bypass deployment problems.
- MUST NOT assume load balancing eliminates downstream bottlenecks.

## SHOULD
- Prefer gradual traffic shifts for risky changes.
- Monitor backend health, response codes, latency, connection counts, and saturation.

## Exceptions
Exceptions require operational justification, bounded duration, monitoring, rollback, and approval.

## Verification
Inspect listener policies, health checks, target health, TLS settings, traffic tests, metrics, and deployment records.