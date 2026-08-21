# Resilient External Call Workflow

```text
Trigger -> classify side effects -> circuit check -> execute -> classify failure
                                      | success -> verify postcondition -> done
                                      | retry -> bounded backoff -> retry
                                      | approval -> stop for human
                                      | stop -> preserve evidence -> fail
```

## Trigger
An agent must call a remote API/tool that can fail transiently or amplify load when retried.

## Entry conditions
Operation intent and target service are known; idempotency is classified; policy is loaded; credentials already exist.

## Stages
1. **Plan:** Call Executor records target, operation, side effects, expected postcondition, timeout, and idempotency mechanism.
2. **Circuit checkpoint:** if open, do not call. If half-open, allow only configured probe count.
3. **Execute:** perform one call with the configured timeout.
4. **Classify:** pass failure status/error kind to `scripts/resilience_gate.py`.
5. **Retry path:** wait returned delay; preserve attempt evidence; retry only while attempt budget remains.
6. **Approval path:** stop for human approval where retry safety or policy override is uncertain.
7. **Stop path:** return failure without further calls.
8. **Success path:** Resilience Verifier independently checks the expected postcondition and policy compliance.
9. **Complete:** report verified success or evidence-backed failure/inconclusive state.

## Checkpoints
Before every call: circuit state + idempotency. After every failure: deterministic gate decision. Before success: independent verification.

## Retry rules
Maximum attempts come from policy and default to 2. Retry only retryable failures. Use bounded exponential backoff with jitter or capped Retry-After. No recursive/unbounded loops.

## Failure paths
Authentication/authorization/business validation -> stop. Tool/configuration error -> stop. Repeated upstream failures -> open circuit and stop. Unknown mutation semantics -> approval/stop. Verification mismatch -> fail and escalate; do not automatically repeat mutation.

## Approval points
Disabling breaker, increasing attempt budget/timeout, bypassing idempotency checks, production policy changes, or retrying a non-idempotent mutation without a proven idempotency mechanism.

## Definition of Done
Operation intent and side effects classified; every attempt stayed within timeout/budget; retry decisions were policy-compliant; circuit state was respected; expected postcondition was independently verified; remaining risk is recorded.
