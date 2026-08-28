# Identity and Secrets Rules

## Purpose
Protect privileged AI infrastructure access and credentials.

## Scope
Applies to human, workload, service, node, and automation identities plus secrets and tokens.

## MUST
- Workloads MUST use scoped identities with least privilege.
- Secrets MUST be stored in approved secret systems and delivered without source-code embedding.
- Privileged actions MUST be attributable to an identity and auditable.
- Credential rotation and revocation procedures MUST be tested for critical services.

## MUST NOT
- MUST NOT place credentials, access tokens, or private keys in images, repositories, logs, or job specifications.
- MUST NOT share persistent human credentials with automation.
- MUST NOT weaken authentication or authorization controls to unblock deployment.

## SHOULD
- Short-lived credentials SHOULD replace static credentials wherever supported.
- Node and workload identities SHOULD be separated.

## Exceptions
Exceptions require security rationale, compensating controls, expiry, and approval.

## Verification
Inspect IAM policies, secret references, token lifetimes, audit logs, repository scanning, runtime configuration, and rotation evidence.