# CI/CD

## Purpose
Make Terraform delivery reproducible, gated, auditable, and resistant to unreviewed changes.

## Scope
Validation, planning, policy checks, approvals, apply pipelines, credentials, and artifacts.

## MUST
- CI MUST run formatting/validation and relevant static, security, and policy checks before merge or apply.
- Production apply pipelines MUST execute reviewed revisions with protected credentials and auditable approvals.
- Plan and apply stages MUST clearly identify target environment and state.
- Failed required checks MUST block normal promotion.

## MUST NOT
- Untrusted fork or pull-request code MUST NOT receive production credentials.
- Pipeline scripts MUST NOT silently suppress Terraform failures.
- Apply pipelines MUST NOT fetch mutable, unreviewed configuration after approval.
- Manual bypasses MUST NOT become routine deployment paths.

## SHOULD
- Plans SHOULD be attached to changes in a reviewer-friendly form.
- Pipelines SHOULD serialize changes that share state.
- Policy-as-code SHOULD enforce critical organization-wide constraints.

## Exceptions
Emergency bypasses require incident/change authority, bounded scope, audit evidence, and retrospective review.

## Verification
Inspect branch protections, workflow definitions, credential permissions, required checks, artifact provenance, approval records, concurrency controls, and execution logs.