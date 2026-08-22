# Transaction Boundary Safety Rules

## MUST
- Preserve evidence for transaction start, persistence, commit/rollback, and each external effect before declaring a defect.
- Model at least these failure windows: effect succeeds then commit fails; commit succeeds then effect fails; retry repeats the effect.
- Keep facts, hypotheses, decisions, and open questions separate.
- Add or update tests for every confirmed failure window affected by a fix.
- Require explicit human approval for schema changes, destructive SQL, production writes, infrastructure/config/secret changes, breaking API changes, irreversible migrations, and weakened security controls.
- Stop after two failed fix/test cycles and preserve evidence.

## MUST NOT
- Treat scanner matches as confirmed defects.
- Send real email, publish real messages, charge payments, mutate production data, or invoke destructive APIs for verification.
- Put remote network calls inside a database transaction merely to make code appear atomic.
- Claim exactly-once delivery unless the complete system contract proves it.
- Introduce an outbox table or migration without approval.
- Disable tests, retries, authentication, authorization, or validation to make verification pass.
- Force push or rewrite Git history.

## SHOULD
- Prefer deterministic repository evidence and tests over inference.
- Prefer idempotent consumers and stable operation identifiers.
- Minimize transaction duration and lock scope.
- Reuse established repository patterns before introducing new infrastructure.
