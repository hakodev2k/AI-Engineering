# MCP Contract Safety Rules
## MUST
- Capture exact baseline and candidate snapshots.
- Run deterministic comparison before compatibility claims.
- Treat removals, new required arguments, and structural argument changes as breaking.
- Migrate known consumers for intentional breaks.
- Preserve report/test evidence.
- Use independent verification.
## MUST NOT
- Edit the baseline to hide drift.
- Auto-approve breaking changes.
- Treat server startup as compatibility proof.
- Weaken security controls to preserve compatibility.
- Force push, deploy production, alter secrets/infrastructure, or perform destructive operations without explicit approval.
- Retry indefinitely.
## SHOULD
- Prefer additive optional fields.
- Prefer aliases/versioning over abrupt removal.
- Remove temporary compatibility only with consumer evidence.
