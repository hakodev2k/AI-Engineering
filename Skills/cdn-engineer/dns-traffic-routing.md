# DNS and Traffic Routing

## Purpose
Design DNS and request-routing behavior that directs users to healthy, performant CDN edges and origins.

## When to use
Use for CDN onboarding, multi-CDN, regional routing, failover, or DNS incident investigation.

## Inputs
Zones, records, TTLs, anycast/CNAME model, health signals, regions, failover requirements.

## Context to inspect
Authoritative DNS, DNSSEC, CAA, CDN hostname mapping, load balancers, origin selection, resolver behavior.

## Core knowledge
DNS TTLs affect control-plane responsiveness but recursive caching limits immediacy. CDN mapping often combines DNS, anycast, latency routing, and internal load balancing.

## Procedure
1. Trace resolution from authoritative zone to edge address.
2. Document ownership and dependencies for every record.
3. Set TTLs according to expected change frequency and failover needs.
4. Validate CNAME/alias chains and apex behavior.
5. Configure health-aware routing where justified.
6. Preserve DNSSEC and CAA correctness.
7. Model resolver caching during failover.
8. Test resolution from multiple networks and regions.
9. Define rollback records before migration.

## Decision points
Use DNS steering for coarse provider/region selection; use CDN internal routing for fast edge decisions. Very low TTLs increase DNS load without guaranteeing instant failover.

## Common failure patterns
Long CNAME chains, stale records, missing certificate authorization, DNSSEC breakage, circular aliases, and failover plans that assume clients honor TTL exactly.

## Verification
Check authoritative and recursive responses, TTLs, DNSSEC validation, geographic answers, and controlled failover behavior.

## Expected output
A documented routing chain with TTL policy, health behavior, migration plan, and validation evidence.

## Stop conditions
Escalate before zone changes when DNS ownership, rollback, or certificate implications are unclear.