# Fallback and Graceful Degradation

## Purpose
Design safe fallback paths when preferred models, providers, regions, or capabilities are unavailable.

## When to use
Use for production routers exposed to provider outages, quota exhaustion, regional failures, model deprecations, or temporary capability loss.

## Inputs
Eligibility policies, provider health, fallback candidates, user-facing SLAs, risk constraints, timeout budget.

## Context to inspect
Historical incidents, retry policies, feature dependencies, structured-output requirements, safety controls, and side effects already executed before failure.

## Core knowledge
Fallback must preserve hard constraints. A technically available model is not a valid fallback if it violates privacy, safety, residency, modality, or contract requirements. Degradation should be intentional and observable.

## Procedure
1. Classify failure types as transient, capacity, policy, capability, or terminal.
2. Define eligible fallback sets per traffic class.
3. Order fallbacks by utility and remaining deadline.
4. Define degraded features explicitly.
5. Prevent retry storms and duplicate side effects.
6. Carry correlation and decision context across fallback attempts.
7. Cap total attempts and total inference time.
8. Return an explicit unavailable/degraded outcome when no compliant route remains.
9. Test provider and regional failure scenarios.

## Decision points
Retry the same backend only for bounded transient failures. Switch providers for independent failure domains. Fail closed when compliance or safety guarantees cannot be maintained.

## Common failure patterns
Infinite fallback loops, bypassing policy, retry amplification, inconsistent response schemas, hidden degraded quality, and exceeding the original request deadline.

## Verification
Verify chaos/failure tests, bounded attempts, policy compliance, deadline adherence, and telemetry showing every fallback reason.

## Expected output
A fallback matrix, bounded retry strategy, degraded-service contract, and tested terminal behavior.

## Stop conditions
Stop if no compliant fallback exists or if fallback could repeat an irreversible side effect.