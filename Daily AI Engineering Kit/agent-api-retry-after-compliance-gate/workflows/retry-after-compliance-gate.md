# Retry-After Compliance Gate

## Trigger
HTTP 429 or configured retryable 503; retry-policy code change; repeated rapid retries; provider throttling incident.

## Entry conditions
First response evidence is preserved and a replay-safe test path exists.

## Inputs
Method, status, Retry-After value, attempt count, endpoint semantics, policy config, relevant client code/tests.

## Stages
1. **Context — Investigator:** locate retry entry point, configuration, tests, and idempotency contract.
2. **Evidence — Investigator:** preserve first response and actual timing/attempt evidence.
3. **Gate — Investigator:** run `scripts/retry_after_gate.py` and compare expected decision with actual behavior.
4. **Plan — Investigator:** define smallest correction and tests.
5. **Approval checkpoint:** stop before enabling retry for non-idempotent operations, changing production config, weakening security, or increasing external traffic.
6. **Implement:** apply only the approved/scoped change.
7. **Test:** reproduce original case plus boundary cases.
8. **Verify — Verification Agent:** inspect diff and rerun independent checks.
9. **Complete:** publish evidence-backed result and remaining risk.

## Produced artifacts
Gate JSON output, captured failure evidence, code/test diff, verification result, and optional investigation report using `templates/retry-investigation-report.md`.

## Checkpoints
No implementation before evidence capture; no unsafe-method retry without approval; no completion without independent verification.

## Retry rules
Tool/environment failures may be retried once after evidence capture. Verification may return once to investigation. A second verification failure stops. API operation retries are capped by `max_retry_attempts`; no workflow stage may override that cap.

## Failure paths
Malformed Retry-After → block and investigate. Missing provider contract → stop and seek authoritative evidence. Production-only reproduction → stop. Retry budget exhausted → preserve last response and fail normally. Permission failure → stop without escalating privileges.

## Definition of Done
Original behavior is evidenced; deterministic gate and implementation agree; Retry-After is honored and capped; retry count is bounded; unsafe methods remain protected unless explicitly approved with idempotency evidence; targeted and surrounding tests pass; independent verifier reports `verified`; remaining risks are documented.
