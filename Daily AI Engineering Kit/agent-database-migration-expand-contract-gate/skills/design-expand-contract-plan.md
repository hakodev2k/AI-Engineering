# Skill: Design Expand-Contract Plan

## Purpose
Convert a risky schema change into bounded deployment phases that keep compatible application versions working while data is backfilled and verified.

## Inputs
Risk investigation, current/target schema, rollout order, application compatibility matrix, and migration policy.

## Procedure
1. Define the expand phase using additive changes where possible: nullable columns, new tables, compatible indexes, or parallel fields.
2. Define application code that can tolerate both old and new representations during transition.
3. Define the data migration/backfill as an idempotent, restartable operation; specify batch size guidance and verification queries without embedding production credentials.
4. Define the cutover condition using measurable evidence, not elapsed time.
5. Define the contract phase that removes obsolete schema only after all writers/readers have migrated and verification is complete.
6. Identify approval points for production migration, destructive operations, type narrowing, large rewrites, or irreversible transforms.
7. Define failure paths: pause, preserve evidence, revert application behavior when possible, or apply a forward fix. Never assume rollback is safe after a data transform.
8. Limit automated retries to two and only for transient tool/build/test failures; never automatically retry destructive SQL.

## Output
A phased plan with `expand`, `transition`, `backfill`, `cutover`, `contract`, verification checkpoints, approval boundaries, and stop conditions.

## Verification
The plan must demonstrate coexistence of old/new application versions during transition, give a concrete completion query for backfill, and separate task execution from verified completion.

## Stop conditions
Stop if the only available plan requires an unapproved breaking contract, destructive action, or unverifiable data transform.
