# Failure Handling Rules

## Purpose
Ensure failures stop safely, preserve evidence, and do not cascade across the network.

## Scope
Exceptions, partial failures, dependency outages, device errors, worker crashes, and recovery decisions.

## MUST
- Failures MUST be classified sufficiently to distinguish validation, authorization, connectivity, device rejection, verification, and systemic errors.
- A target failure MUST have an explicit policy for continue, halt scope, rollback, or escalate.
- Systemic indicators MUST halt or reduce rollout before the full fleet is affected.
- Partial completion MUST be persisted so recovery can reason from actual state.
- Unexpected exceptions MUST preserve diagnostic context and MUST NOT be silently swallowed.

## MUST NOT
- MUST NOT convert failed mutations or required verification into success merely to keep a pipeline moving.
- MUST NOT continue broad rollout after a safety threshold is exceeded.
- MUST NOT retry unknown side effects without checking resulting state.

## SHOULD
- Failure policies SHOULD be risk-sensitive by operation class and failure domain.
- Error messages SHOULD include actionable target/context identifiers without secrets.

## Exceptions
Continuing after a normally blocking failure requires explicit documented rationale, bounded targets, compensating checks, and authorized approval.

## Verification
Inject device rejection, worker interruption, dependency outage, partial success, and verification failure; inspect persisted state, halt thresholds, diagnostics, and recovery behavior.