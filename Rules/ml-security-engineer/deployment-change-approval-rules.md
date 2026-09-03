# Deployment Change Approval Rules

## Purpose
Prevent AI-assisted or automated ML changes from exceeding authorized production authority.

## Scope
Applies to production model deployment, rollback, security-control changes, registry promotion, access changes, and destructive actions.

## MUST
- Distinguish analysis, recommendation, preparation, and execution in all high-risk operational workflows.
- Require human approval before production deployment, breaking interface changes, destructive data operations, secret rotation, privilege expansion, or weakening security controls.
- Present the exact artifact version, evaluated risk, expected impact, rollback path, and verification plan before approval.
- Revalidate approval when the artifact, configuration, target environment, or material risk changes.

## MUST NOT
- Treat prior approval for analysis or staging as authorization for production execution.
- Force push, rewrite shared history, destroy infrastructure, or bypass required controls to unblock deployment.
- Hide unresolved security findings from approvers.

## SHOULD
- Prefer reversible, incremental deployments with explicit stop conditions.
- Use independent approval for changes that combine model promotion with privileged access changes.

## Exceptions
Emergency actions must follow documented incident authority, minimize scope, preserve evidence, and receive retrospective review.

## Verification
Inspect approval records, deployment diffs, artifact identifiers, IAM changes, rollback evidence, and production audit logs.