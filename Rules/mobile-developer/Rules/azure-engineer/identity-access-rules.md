# Identity and Access Rules

## Purpose
Protect Azure resources through explicit identity boundaries and least privilege.

## Scope
Microsoft Entra ID, managed identities, service principals, RBAC, privileged access, and workload authentication.

## MUST
- Use least-privilege roles scoped to the smallest practical resource boundary.
- Prefer managed identities over stored application credentials when supported.
- Separate human, workload, deployment, and emergency identities.
- Require explicit review for privileged role assignments and cross-tenant access.
- Record the owner and purpose of non-human identities.

## MUST NOT
- Use shared administrator accounts for routine operations.
- Grant Owner or equivalent broad privilege merely to unblock deployment.
- Embed client secrets, certificates, or tokens in source code or deployment templates.

## SHOULD
- Use time-bound privileged access and periodic access reviews for elevated permissions.
- Prefer group-based assignments over direct user grants where governance permits.

## Exceptions
Exceptions require documented need, scope, duration, compensating controls, owner, and approval.

## Verification
Inspect RBAC assignments, Entra configuration, managed identity usage, credential stores, access reviews, and deployment identities.