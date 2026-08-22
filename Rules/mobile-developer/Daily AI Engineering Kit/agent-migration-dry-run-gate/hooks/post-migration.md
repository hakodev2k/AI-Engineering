# Hook: Post-Migration Verification

## Trigger
Immediately after a non-production migration dry run.

## Preconditions
- Pre-migration gate passed.
- Dry-run target identity was recorded.
- Migration command completed and output was preserved.

## Action
1. Confirm the command exit code is zero.
2. Run the migration-plan verification commands.
3. Run project-native build/tests listed in the plan.
4. Compare actual schema state with `expected_schema_changes`.
5. Check required data invariants.
6. Confirm rollback/roll-forward remains available.
7. Hand evidence to the Migration Verifier.

## Expected result
All checks pass and the independent verifier returns `verified`.

## Failure behavior
Mark the run `blocked`, preserve evidence, and return to planning or implementation. Transient tooling failures may be retried at most twice.

## Blocking
Yes. A failed post-migration hook prevents a production-readiness claim.
