# DDoS Resilience

## Purpose
Engineer network and application-edge defenses that preserve critical services during volumetric, protocol, and application-layer denial-of-service attacks.

## When to use
Use for internet-facing architecture, capacity reviews, DDoS incidents, or mitigation-provider onboarding.

## Inputs
Traffic baselines, service criticality, upstream capacity, provider capabilities, DNS/CDN/WAF architecture, incident history.

## Context to inspect
Internet links, routing, load balancers, firewalls, CDN, scrubbing services, rate limits, autoscaling, origin exposure.

## Core knowledge
Attack classes, saturation points, anycast/CDN, scrubbing, RTBH/FlowSpec concepts, rate limiting, state exhaustion, origin shielding.

## Procedure
1. Identify service bottlenecks and saturation points.
2. Establish normal traffic baselines.
3. Reduce direct origin exposure.
4. Configure upstream mitigation and routing procedures.
5. Harden stateful devices against exhaustion.
6. Define safe rate limits and degradation modes.
7. Create escalation and provider contacts.
8. Exercise mitigation with simulations or tabletop tests.

## Decision points
Use always-on mitigation for high-criticality targets; on-demand when cost and latency trade-offs justify activation delay.

## Common failure patterns
Oversized edge but undersized upstream, exposed origins, untested provider activation, stateful firewall exhaustion, aggressive rate limits harming legitimate users.

## Verification
Validate telemetry, provider activation path, failover, origin shielding, and controlled load tests within approved limits.

## Expected output
DDoS architecture, thresholds, mitigation runbook, provider escalation path, test evidence.

## Stop conditions
Do not perform uncontrolled stress tests or routing changes without authorization and rollback capability.