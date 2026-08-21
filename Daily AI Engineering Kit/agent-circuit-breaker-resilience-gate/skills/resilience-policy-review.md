# Resilience Policy Review Skill

## Purpose
Review retry, timeout, and circuit-breaker changes before they increase load, duplicate side effects, or hide outages.

## Inputs
Current policy, proposed policy, service SLOs, operation semantics, recent failure evidence, and environment.

## Process
1. Compare current and proposed timeout, retry budget, backoff, open duration, and failure thresholds.
2. Determine whether the change can multiply traffic during upstream degradation.
3. Confirm non-idempotent operations remain excluded from automatic retry unless protected by an idempotency key or equivalent guarantee.
4. Check that authentication/authorization/business-rule failures remain non-retryable.
5. Confirm Retry-After is capped.
6. Require explicit human approval before disabling the breaker, increasing attempt budget/timeout, bypassing idempotency checks, or changing production policy.
7. Validate the proposal against representative failure cases with `scripts/resilience_gate.py`.
8. Record trade-offs and rollback to the previous policy.

## Expected output
Decision, changed controls, traffic-amplification risk, duplicate-side-effect risk, evidence, approval requirement, and rollback plan.

## Verification
At least one retryable, one non-retryable, one non-idempotent, and one circuit-open scenario are evaluated.

## Stop conditions
Unknown operation semantics, missing rollback, missing approval for protected changes, or a proposal that creates unbounded retries/timeouts.
