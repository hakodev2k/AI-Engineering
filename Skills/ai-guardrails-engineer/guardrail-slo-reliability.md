# Guardrail SLO and Reliability Engineering

## Purpose
Keep runtime guardrails effective under latency, dependency, and capacity failures.

## When to use
Use for classifiers, policy services, approvals, validators, gateways.

## Inputs
Risk, traffic, latency, dependencies, incidents, availability.

## Context to inspect
Inspect timeouts, retries, breakers, capacity, regions, caches, fallbacks.

## Core knowledge
Accurate but unavailable controls are unreliable. Distinguish critical invariants from advisory checks and prevent retry storms.

## Procedure
1. Classify criticality.
2. Define SLOs.
3. Bound timeout/retry.
4. Define failure behavior.
5. Remove critical SPOFs.
6. Capacity-test peaks/abuse.
7. Add meaningful health signals.
8. Exercise failures.
9. Track error budgets.
10. Review incidents.

## Decision points
Fail closed for authorization/irreversible risk; choose conservative fallback for lower-risk semantics.

## Common failure patterns
Infinite retry, timeout-as-safe, shallow health, no overload plan, excessive latency.

## Verification
Chaos-test while preserving invariants.

## Expected output
SLOs, fallback matrix, capacity evidence, runbooks.

## Stop conditions
Stop without tested critical failure behavior.