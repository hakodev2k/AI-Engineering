# Reliability and Fallbacks

## Purpose
Design inference failure handling that preserves service continuity without hiding correctness, quality, or capacity problems.

## When to use
Use when serving depends on accelerators, model runtimes, external providers, or distributed components that can fail independently.

## Inputs
Availability targets, dependency map, failure history, fallback models/providers, retry policies, timeout budgets, and quality constraints.

## Context to inspect
Inspect health checks, replica readiness, model load failures, device errors, runtime crashes, provider quotas, network partitions, and retry behavior.

## Core knowledge
Retries consume scarce inference capacity and can amplify outages. Fallbacks must be bounded by quality and policy constraints. Readiness should indicate ability to serve real requests, not merely process liveness.

## Procedure
1. Enumerate realistic failure modes by dependency.
2. Define detection signals and timeouts for each mode.
3. Set retry eligibility, limits, jitter, and deadlines.
4. Define local, cross-pool, or cross-provider fallbacks.
5. Validate compatibility of tokenizer, context, outputs, and safety policy.
6. Prevent unhealthy replicas from receiving new work.
7. Add circuit breaking for persistent downstream failure.
8. Test partial device, node, zone, and provider failures.
9. Measure recovery time and retry amplification.
10. Document failback and rollback procedures.

## Decision points
Retry only transient failures within the caller's remaining deadline. Fail over when alternate capacity and quality are acceptable. Fail closed when fallback would violate safety, residency, or contractual requirements.

## Common failure patterns
Infinite retries, shallow liveness checks, fallback models with incompatible behavior, retry storms, serving before model warmup, and treating degraded quality as normal success.

## Verification
Verified means fault injection demonstrates bounded retries, correct routing away from failures, preserved critical behavior, and recovery within defined objectives.

## Expected output
Failure matrix, retry/fallback policy, health criteria, test evidence, and recovery runbook.

## Stop conditions
Escalate when no compliant fallback exists, failures risk data corruption or safety violations, or required redundancy cannot be provisioned.