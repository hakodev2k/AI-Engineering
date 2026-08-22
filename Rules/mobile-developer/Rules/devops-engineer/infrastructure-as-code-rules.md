# Infrastructure as Code Rules

## Purpose
Ensure infrastructure is reviewable, reproducible, and safely changeable.

## Scope
Applies to Terraform, Bicep, CloudFormation, Pulumi, ARM, Helm, and equivalent infrastructure definitions.

## MUST
- Managed infrastructure MUST be represented in version-controlled code unless a documented exception exists.
- Plans or previews MUST be reviewed before high-impact apply operations.
- State backends MUST be protected, access-controlled, and recoverable.
- Modules MUST expose clear inputs, outputs, defaults, and ownership boundaries.
- Destructive replacements MUST be identified before apply.

## MUST NOT
- MUST NOT manually mutate managed resources and leave the drift unresolved.
- MUST NOT store secrets in infrastructure source or unprotected state.
- MUST NOT apply destructive changes to production without explicit approval.

## SHOULD
- Prefer small composable modules and explicit dependencies.
- Prefer policy checks and drift detection in CI.

## Exceptions
Manual intervention is allowed for urgent recovery only when recorded and reconciled back into code afterward.

## Verification
Review plans, state protection, drift reports, policy checks, code review history, and post-apply resource state.