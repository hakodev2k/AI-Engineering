# Skill: Outbox Implementation

## Purpose
Implement the smallest safe transactional-outbox change after the failure windows are understood.

## Inputs
Investigation evidence, approved scope, repository conventions, test commands.

## Preconditions
The transaction boundary and publish path are known. Any required schema change is prepared but not executed without approval.

## Allowed tools
Repository editing, local formatter/build/test tooling, static scanner.

## Constraints
Preserve public API/message contracts unless explicitly required. Do not add broker or database permissions. Do not rely on infinite retries.

## Procedure
1. Persist the business state and outbox record through the same database transaction/unit of work.
2. Give each outbox message a stable unique identifier and immutable payload metadata needed for delivery.
3. Remove or bypass direct publication from the protected domain transaction when it would reintroduce a dual write.
4. Make the dispatcher select only eligible pending records.
5. Prevent uncontrolled concurrent ownership using the repository's safe claim/lease/locking primitive where required.
6. Publish outside the business transaction.
7. Record successful completion durably or use a documented safe deletion policy.
8. On failure, retain the record with bounded retry/backoff metadata; classify terminal/poison failures rather than retrying forever.
9. Ensure duplicate publication is tolerated by an idempotency key, consumer deduplication, or a broker capability that is explicitly proven.
10. Add tests for atomic rollback, publish failure, retry, duplicate dispatch, and concurrent claiming when applicable.
11. Run formatter, build/tests, scanner, and inspect the diff for unrelated changes.

## Expected output
Minimal code/config/test changes plus updated evidence.

## Verification
Implementation is not complete until the independent verifier confirms atomic persistence, retry behavior, and duplicate tolerance.

## Failure handling
A failing test may trigger at most two implementation retries. Preserve failing output and the hypothesis tested on each retry.

## Stop conditions
Stop before executing migrations, production deployment/config changes, broker infrastructure changes, destructive SQL, secret changes, or breaking contracts without human approval.
