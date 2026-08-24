# Apply and Approval

## Purpose
Ensure execution authority is explicit and production changes remain controlled.

## Scope
Terraform apply, destroy, targeted execution, approvals, and automation identities.

## MUST
- Production apply and destroy operations MUST require explicit human approval unless a documented governance policy authorizes a narrowly scoped automated path.
- Execution identities MUST use least privilege and be attributable.
- Apply MUST use reviewed configuration and an approved plan where the workflow supports saved plans.
- Destructive or irreversible changes MUST include recovery and rollback considerations before approval.

## MUST NOT
- An AI agent MUST NOT infer authority to execute production changes from authority to analyze, recommend, or prepare them.
- `-auto-approve` MUST NOT bypass required governance.
- `-target` MUST NOT be used as a routine deployment mechanism.
- Destroy operations MUST NOT run against ambiguous environment context.

## SHOULD
- Production execution SHOULD occur through auditable CI/CD rather than individual workstations.

## Exceptions
Incident procedures may allow expedited approval, but identity, scope, evidence, and post-action review remain required.

## Verification
Inspect workflow permissions, approval records, plan/apply linkage, execution identity, command history, environment selection, and audit logs.