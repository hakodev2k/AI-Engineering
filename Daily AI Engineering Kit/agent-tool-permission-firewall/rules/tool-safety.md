# Tool Safety Rules

## MUST

- Create a permission request before every non-trivial write or external mutation.
- Run deterministic policy evaluation before execution.
- Use the least-powerful tool/action that can complete the task.
- Require explicit human approval when policy returns `approval_required`.
- Record the request, decision, and execution result.
- Stop if actual execution would exceed the approved target or scope.
- Treat missing or invalid policy as a blocking failure.

## MUST NOT

- Execute an action classified `deny`.
- Read, print, copy, or upload secrets unless the task explicitly requires it and policy permits it.
- Change production, infrastructure, permissions, schema, durable data, or Git history without explicit approval.
- Use command obfuscation, alternate binaries, scripts, or command splitting to bypass policy.
- Convert a read-only request into a write operation without a new policy decision.
- Reuse approval for a different target, environment, command, or later task.
- Disable security controls to make a task easier.

## SHOULD

- Prefer status/list/diff/dry-run operations before mutations.
- Prefer reversible operations over irreversible ones.
- Narrow file globs, database predicates, cloud scopes, and Git targets.
- Explain why a risky action is necessary and provide a safer alternative where practical.
- Keep audit records local unless the repository explicitly configures another destination.

## Mandatory approval boundaries

Explicit human approval is required for:

- production deployment/configuration;
- database schema or data mutation outside disposable test data;
- secret or credential modification;
- IAM/permission/security-control changes;
- infrastructure creation/update/deletion;
- file deletion outside generated temporary artifacts;
- force push/history rewrite;
- breaking public contracts;
- large dependency upgrades;
- commands with destructive wildcard scope.
