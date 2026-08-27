# Traffic Requirements Analysis

## Purpose
Translate business and application requirements into measurable load-balancing constraints so topology and algorithms are selected from evidence rather than habit.

## When to use
Use for new services, major traffic growth, migrations, protocol changes, or recurring capacity incidents. Do not use as a substitute for application profiling when the bottleneck is known to be inside the service.

## Inputs
Traffic forecasts, request rates, concurrency, payload sizes, protocols, latency SLOs, availability targets, geography, client behavior, dependency limits, and cost constraints.

## Preconditions
Identify service owners and the source and confidence of traffic estimates. Separate current observations from forecasts.

## Context to inspect
Inspect traffic telemetry, architecture diagrams, DNS and routing, ingress/egress paths, connection lifetimes, TLS behavior, autoscaling, health checks, failure domains, and historical incidents.

## Core knowledge
Peak RPS alone is insufficient. Connection rate, concurrent connections, bandwidth, packet rate, TLS handshakes, long-lived sessions, request skew, retries, and regional failure scenarios can dominate capacity. Senior analysis includes normal load, bursts, degraded-mode load, and failover load.

## Procedure
1. Identify consumers, protocols, and critical request paths.
2. Establish baseline and peak RPS, connection rate, concurrency, bandwidth, and payload distributions.
3. Define latency, availability, recovery, and data-residency constraints.
4. Model burstiness, retry amplification, and traffic skew.
5. Model loss of a zone, region, or load-balancer tier.
6. Identify stateful behaviors such as WebSockets, affinity, uploads, or streaming.
7. Quantify headroom and scaling lead time.
8. Document assumptions and confidence ranges.
9. Convert findings into capacity, routing, health-check, and observability requirements.
10. Validate requirements with service and platform owners.

## Decision points
Prefer explicit headroom when scaling is slow or failure redistribution is large. Use regional isolation when blast-radius control matters more than global utilization. Treat affinity as a constraint only when application state genuinely requires it.

## Common failure patterns
Sizing only by average RPS; ignoring connection churn; assuming uniform requests; forgetting retry storms; planning normal capacity but not failover capacity; accepting forecasts without confidence ranges.

## Verification
Verify requirements against production telemetry and load-test evidence. Confirm modeled failover load fits surviving capacity and that SLO assumptions match service objectives.

## Expected output
A quantified traffic profile, failure scenarios, capacity envelope, constraints, assumptions, and design requirements.

## Stop conditions
Escalate when traffic data is unavailable, SLO ownership is unclear, forecasts conflict materially, or required failover capacity exceeds feasible infrastructure.