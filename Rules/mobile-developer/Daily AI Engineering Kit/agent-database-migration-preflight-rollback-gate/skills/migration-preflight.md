# Migration Preflight Skill

## Purpose
Prepare a database migration so an agent can prove scope, rollout safety, rollback readiness, and post-migration verification before any execution authority is used.

## When to use
Use for schema migrations, index changes, constraints, large data backfills, column/table renames, and application changes that require coordinated database evolution.

## Inputs
Change request, target environment, database engine/version, migration files, application compatibility requirements, estimated row counts, operational constraints, and policy.

## Preconditions
- Target environment is explicit.
- Repository migration mechanism is identified.
- Agent has read-only access to schema/metadata where possible.
- Production execution credentials are not required for planning.

## Allowed tools
Repository search/read, schema metadata, migration generation in development, query-plan inspection, static gate, tests, build tools, read-only database tools.

## Constraints
- Never execute production migrations from this skill.
- Do not infer zero-downtime safety from successful migration generation alone.
- Do not weaken timeouts, policy, constraints, or approval boundaries to obtain a pass.
- Separate schema compatibility from data-backfill safety.

## Procedure
1. Identify current schema, migration history, application versions, and affected read/write paths.
2. Classify every operation using the plan contract.
3. Determine whether old and new application versions must coexist during rollout.
4. Mark breaking changes and require expand/contract when compatibility would otherwise be lost.
5. Estimate affected rows for backfills and identify batching, ordering, checkpoint, and resume semantics.
6. Define lock and statement timeouts appropriate to the target environment.
7. Define rollback or forward-fix/compensation strategy and note any possible data loss.
8. Define measurable post-migration checks: schema presence, row invariants, application smoke checks, error rates, or query health.
9. Fill a migration plan from `templates/migration-plan.json`.
10. Run `scripts/migration_gate.py` against `config/policy.json`.
11. If blocked, preserve the result and revise the plan only when the underlying risk can actually be reduced. Maximum two revisions.
12. If approval is required, prepare the exact plan artifact for human review; any material plan change invalidates prior approval.
13. Hand the gated plan to the Migration Verifier for independent review.

## Expected output
Exact migration plan path, gate status, affected objects, compatibility assessment, estimated scope, rollback/compensation strategy, verification checks, approval status, and unresolved risks.

## Verification
The gate is reproducible; operation classification matches repository/schema evidence; compatibility assumptions are supported; backfills are bounded; verification checks are measurable.

## Failure handling
Tool/environment failure: retry once without changing inputs. Missing schema evidence or unknown migration ordering: stop. Two failed plan revisions: escalate. Permission failure: stop without privilege expansion.

## Stop conditions
Unknown target environment, unbounded destructive operation, missing rollback where required, missing backup evidence for destructive work, incompatible rolling deployment without expand/contract, or inability to verify postconditions.
