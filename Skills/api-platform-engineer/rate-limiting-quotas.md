# Rate Limiting and Quotas

## Purpose
Protect API capacity and enforce fair, intentional consumption limits.

## When to use
Use for public/partner APIs, shared internal platforms, abuse protection, overload prevention, or tiered service plans.

## Inputs
Traffic distributions, consumer identities, capacity limits, SLOs, business quotas, burst characteristics.

## Context to inspect
Inspect current concurrency, request cost, retry behavior, hot consumers, gateway capabilities, and downstream bottlenecks.

## Core knowledge
Rate limits control request velocity; quotas constrain consumption over longer windows; concurrency limits protect scarce in-flight capacity. Limits should reflect resource cost rather than arbitrary request counts when workloads vary significantly.

## Procedure
1. Establish protected resource and overload threshold.
2. Segment consumers by identity and service tier.
3. Choose rate, burst, quota, and concurrency dimensions.
4. Select algorithm such as token bucket or sliding window.
5. Define distributed state and failure behavior.
6. Return consistent limit metadata and retry guidance.
7. Prevent retries from amplifying throttling.
8. Test burst and sustained traffic.
9. Roll out progressively and monitor rejected traffic.
10. Recalibrate using capacity evidence.

## Decision points
Fail-open only when abuse/capacity risk is low; fail-closed when protecting critical resources. Prefer per-consumer isolation over one global bucket.

## Common failure patterns
Limits unrelated to capacity, IP-only identity, synchronized reset spikes, hidden throttling, and retry storms.

## Verification
Load-test thresholds, validate fairness, inspect downstream saturation, and verify correct 429 behavior and telemetry.

## Expected output
Evidence-based limits that protect capacity without unnecessarily harming legitimate consumers.

## Stop conditions
Stop if capacity boundaries or consumer identity cannot be established.