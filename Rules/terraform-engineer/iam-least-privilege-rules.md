# IAM and Least Privilege

## Purpose
Constrain Terraform and provisioned identities to necessary authority.

## Scope
Execution roles, service identities, IAM resources, trust policies, and delegated permissions.

## MUST
- Terraform execution identities MUST have permissions scoped to their managed estate and required operations.
- IAM changes MUST be reviewed for privilege escalation paths, trust relationships, wildcard actions/resources, and cross-account or cross-project access.
- High-risk access changes MUST require human approval.
- Separation of duties MUST be preserved where policy requires it.

## MUST NOT
- Administrative wildcard permissions MUST NOT be granted as a convenience.
- CI identities MUST NOT share long-lived personal credentials.
- Trust policies MUST NOT admit broader principals than intended.
- Security controls MUST NOT be weakened merely to make Terraform apply succeed.

## SHOULD
- Permission boundaries, policy conditions, workload identity, and temporary credentials SHOULD be used where they reduce blast radius.

## Exceptions
Broader permissions require documented technical necessity, bounded scope/time, risk review, compensating controls, and approval.

## Verification
Inspect IAM diffs, effective permissions, trust relationships, policy analyzers, cloud audit logs, credential sources, and security-policy checks.