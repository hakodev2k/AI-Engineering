# Hook: Pre-Migration Gate

## Trigger
Before any migration or schema-changing command is executed by an agent.

## Preconditions
- Migration files are known.
- Repository root is known.
- Planned target environment is known.

## Action
1. Run `python scripts/analyze-migration.py <migration-files...>`.
2. Run `python scripts/verify-plan.py <migration-plan.yaml>`.
3. Confirm the execution target is explicitly non-production for automated execution.
4. If analyzer output contains `blocked=true`, stop.
5. If plan status is `needs-approval` or approval is required but absent, stop.

## Expected result
Static analysis exits 0 and plan verification exits 0.

## Failure behavior
Preserve stdout/stderr and return a blocking failure. Do not broaden permissions, edit the plan silently, or execute the migration.

## Blocking
Yes.
