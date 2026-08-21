# Idempotency & Retry Safety Rules

## MUST
- Inventory every externally visible side effect reachable from a changed retryable boundary.
- Record the retry/redelivery trigger, maximum attempts, and failure acknowledgment behavior.
- Provide repository evidence for every claim that a side effect is idempotent.
- Test duplicate logical delivery at least twice for changed high-risk paths.
- Test a retry after a failure point that occurs after a side effect when technically reproducible.
- Preserve failing commands, outputs, and changed-file evidence across retry cycles.
- Stop before any approval-required action listed in `config/idempotency-gate.yaml`.
- Keep assessment output compatible with `schemas/assessment.schema.json`.

## MUST NOT
- Assume `POST`, background jobs, queue consumers, or external SDK calls are idempotent by default.
- Treat retry count limits as duplicate-side-effect protection.
- Remove retries, acknowledgments, transactions, unique constraints, or validation merely to make tests pass.
- Add a database migration, modify production retry/redelivery configuration, change payment semantics, or break an API contract without explicit approval.
- Store secrets, access tokens, full credentials, or unredacted sensitive payloads in assessment evidence.
- Mark status `pass` when any required verification is `fail` or `not-run`.
- Use infinite retries or unbounded autonomous fix loops.

## SHOULD
- Prefer deterministic uniqueness enforcement over best-effort in-memory deduplication.
- Prefer stable business/request/message keys over timestamps or randomly generated keys created inside the retry loop.
- Keep the idempotency guard adjacent to the side-effect boundary or persistence transaction when practical.
- Verify concurrency behavior when duplicate executions may overlap.
- Add regression tests that reproduce the confirmed failure mode rather than only unit-testing helper methods.
