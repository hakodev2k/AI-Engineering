# Skill: Remediate With an Outbox

## Purpose
Convert a confirmed database-plus-external-side-effect race into durable local intent followed by retryable dispatch.

## Inputs
Confirmed finding, domain transaction boundary, existing persistence conventions, dispatcher/consumer behavior.

## Process
1. Define the event payload and stable idempotency key.
2. Persist domain changes and outbox record in the same local database transaction.
3. Remove direct external delivery from the transaction path.
4. Dispatch committed outbox records asynchronously with bounded retries and observable failure state.
5. Mark delivery only after provider acceptance; make duplicate dispatch harmless using the idempotency key.
6. Preserve payload/version compatibility and avoid secrets in outbox data.
7. Add tests proving rollback creates neither domain state nor dispatchable intent; commit creates both; repeated dispatch does not duplicate the business effect.
8. Require approval before adding/changing schema or production worker/infrastructure configuration.
9. Build, test, scan, and inspect the diff.

## Verification
Evidence must show atomic local persistence, bounded retry, deduplication behavior, passing tests, and no direct external call remaining in the risky transaction path.

## Failure handling
Do not fall back to fire-and-forget delivery. After two implementation/test repair cycles, stop with logs, failing commands, and unresolved findings.