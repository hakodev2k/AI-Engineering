# Workspace Boundary Safety Rules

## MUST
- Treat the configured workspace root as a security boundary.
- Validate planned create/edit/rename destinations before writes.
- Resolve the nearest existing ancestor of not-yet-created files.
- Block broken links and external resolved targets.
- Rerun validation when link/path topology changes.
- Run a final full scan and changed-file review.
- Require independent verification.

## MUST NOT
- Rely only on string-prefix containment checks.
- Follow an external symlink/junction to complete the task.
- Broaden the trusted root to make a failing check pass without explicit approval.
- Replace/delete a link, increase filesystem permissions, or alter mounts without explicit approval.
- Force push, rewrite history, change secrets/infrastructure/production configuration, weaken security controls, or perform destructive operations without approval.
- Ignore a broken link or metadata error.

## SHOULD
- Prefer real in-repository directories for agent-owned generated output.
- Keep link usage visible in repository documentation when intentional.
- Validate immediately before write to reduce time-of-check/time-of-use risk.
- Run agents with least filesystem privilege.