# IAM and Access Rules
## Purpose
Enforce least privilege and auditable access across AWS environments.
## Scope
IAM identities, roles, policies, federation, service principals, and privileged access.
## MUST
- Grant only permissions required for the documented workload or operator task.
- Prefer short-lived federated credentials and workload roles over long-lived access keys.
- Separate human, workload, deployment, and break-glass identities.
- Require explicit review for wildcard actions or resources in privileged policies.
## MUST NOT
- Embed AWS credentials in source, images, scripts, logs, or configuration committed to version control.
- Use root credentials for routine administration.
- Weaken MFA or access controls merely to unblock delivery.
## SHOULD
- Use permission boundaries, SCPs, and policy conditions where they materially reduce blast radius.
- Periodically remove unused permissions and credentials using access evidence.
## Exceptions
Exceptions require owner, business reason, risk, duration, compensating controls, and approval.
## Verification
Inspect IAM policies, CloudTrail evidence, credential reports, Access Analyzer findings, federation settings, and CI security checks.