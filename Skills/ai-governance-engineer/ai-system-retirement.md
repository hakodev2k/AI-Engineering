# AI System Retirement

## Purpose
Retire AI systems, models, datasets, credentials, integrations, and governance records safely while preserving required evidence and preventing orphaned use.

## When to use
Use for decommissioning, provider exit, model replacement, end-of-life, or prohibited use termination.

## Inputs
Inventory, dependency map, users, data stores, credentials, contracts, retention requirements, replacement plan, monitoring.

## Procedure
1. Confirm retirement scope and accountable owner.
2. Identify consumers, downstream dependencies, and fallback/replacement paths.
3. Freeze new adoption and communicate timelines.
4. Migrate or terminate dependent workflows safely.
5. Revoke credentials, endpoints, tools, and automated jobs.
6. Apply data retention/deletion and licensing obligations.
7. Archive required approvals, evaluations, incidents, and audit evidence.
8. Terminate vendor resources and validate billing/access closure.
9. Monitor for residual traffic or shadow copies.
10. Mark inventory records retired with effective date and evidence.

## Decision points
Preserve records required for audit or legal purposes even when operational data should be deleted. Run parallel replacement only when risk justifies overlap.

## Common failure patterns
Orphaned API keys, hidden downstream users, retained sensitive logs, inventory record deleted instead of retired, vendor billing left active.

## Verification
No unauthorized traffic remains; access is revoked; required data actions and evidence retention are complete; dependencies confirm migration.

## Expected output
Verified retirement record and archived evidence package.

## Stop conditions
Stop destructive deletion when retention obligations, litigation hold, or dependency ownership is unresolved.