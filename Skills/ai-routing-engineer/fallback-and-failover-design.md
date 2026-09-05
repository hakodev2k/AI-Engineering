# Fallback and Failover Design

## Purpose
Design safe fallback behavior for model, provider, region, and dependency failures without silently degrading correctness or violating policy.

## When to use
Use when primary routes can fail because of outages, throttling, quota exhaustion, model unavailability, or degraded quality.

## Inputs
Primary and alternate models, compatibility evaluations, failure modes, timeout budgets, SLOs, risk tier, and business continuity requirements.

## Preconditions
Every fallback candidate must be explicitly validated for the workload it may receive.

## Context to inspect
Current retry/fallback chain, model registry, provider health signals, tool and schema compatibility, feature flags, incident history, and degraded-mode UX.

## Core knowledge
Failover is a behavioral change, not just an infrastructure change. Alternate models may differ in context window, refusal behavior, tool semantics, output schema, tokenization, and cost. Some workloads should fail closed rather than degrade.

## Procedure
1. Enumerate failure modes that require alternate routing.
2. Define which failures are retryable versus failover-worthy.
3. Identify eligible fallback models per request class.
4. Validate output, tool, safety, and schema compatibility.
5. Bound the total retry and fallback time budget.
6. Define maximum failover depth.
7. Mark workloads that must fail closed.
8. Add user-visible degraded-mode signals when needed.
9. Test forced failures and recovery.
10. Monitor fallback rate and downstream quality.

## Decision points
Prefer no response over unsafe degradation for high-risk workflows. Use same-provider fallback only if it reduces correlated failure risk enough to be useful. Avoid long fallback chains that consume the full latency budget.

## Common failure patterns
Blindly routing to a cheaper model, infinite chains, retrying non-idempotent tool use, and restoring primaries before stability is established.

## Verification
Inject provider/model failures and confirm only eligible alternatives are used, latency stays bounded, and safety/contract tests still pass.

## Expected output
A bounded fallback graph, eligibility rules, failure triggers, recovery criteria, and test evidence.

## Stop conditions
Stop if no validated fallback exists or if failover would violate safety, privacy, residency, or contract guarantees.