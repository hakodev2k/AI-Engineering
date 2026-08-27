# Deployment and Release Rules

## Purpose
Protect production stability during Salesforce releases.

## Scope
Applies to metadata promotion, packages, code releases, and release sequencing.

## MUST
- Production releases MUST use reviewed source-controlled changes.
- Releases MUST identify dependencies, validation evidence, and recovery steps.
- High-risk changes MUST be validated in a representative environment before production.
- Production deployment MUST require authorized human approval.

## MUST NOT
- MUST NOT use untracked production-only changes as the normal delivery process.
- MUST NOT deploy destructive metadata changes without dependency analysis and approval.
- MUST NOT declare release success before critical post-deployment checks pass.

## SHOULD
- Releases SHOULD be small enough to isolate failures.
- Deployment automation SHOULD stop when required validation is missing.

## Exceptions
Emergency changes require incident context, approver, post-change evidence, and source reconciliation.

## Verification
Inspect source diffs, deployment manifests, CI results, approval evidence, dependency checks, and post-release validation.