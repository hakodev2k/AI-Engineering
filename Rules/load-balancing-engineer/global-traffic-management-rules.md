# Global Traffic Management Rules

## Purpose
Control cross-region traffic safely while accounting for latency, health, sovereignty, and regional capacity.

## Scope
DNS/GSLB, anycast, global proxies, geo routing, weighted routing, and regional failover.

## MUST
- Global routing policy MUST define region eligibility, health criteria, failover order, capacity constraints, and convergence expectations.
- Regional evacuation MUST account for whether surviving regions can absorb displaced traffic.
- Data residency or regulatory routing constraints MUST be enforced independently of convenience-based latency routing where required.
- DNS-based failover MUST account for TTL, resolver caching, and clients that ignore intended caching behavior.
- Major weight changes MUST be staged and observed.

## MUST NOT
- MUST NOT fail traffic into a region without confirmed capacity and dependency readiness.
- MUST NOT assume DNS changes provide instantaneous failover.
- MUST NOT use geolocation as proof of user identity or authorization.

## SHOULD
- Prefer gradual regional shifts and measurable guardrails.
- Maintain a tested evacuation procedure for critical regions.

## Exceptions
Emergency routing may bypass normal staging only with incident authority and immediate monitoring.

## Verification
Run regional-failure exercises; inspect distribution, convergence time, error rate, latency, capacity, DNS behavior, and policy compliance.