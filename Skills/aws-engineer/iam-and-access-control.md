# IAM and Access Control

## Purpose
Design and review AWS identity and authorization controls using least privilege, short-lived credentials, and auditable access paths.

## When to use
Use for new roles, cross-account access, workforce authentication, service permissions, access reviews, or privilege reduction.

## Inputs
Actor/service identity, required actions, target resources, trust relationships, session duration, access frequency, compliance constraints.

## Context to inspect
IAM roles/policies, Identity Center, resource policies, permission boundaries, SCPs, KMS key policies, CloudTrail, access analyzer findings.

## Core knowledge
Effective permissions are the intersection of identity policies, resource policies, permission boundaries, SCPs, session policies, and explicit denies. Prefer role assumption over long-lived access keys.

## Procedure
1. Identify who or what needs access and why.
2. Enumerate required API actions and resources from real workflows.
3. Prefer federation or workload roles over IAM users.
4. Define trust policy separately from permission policy.
5. Scope resources and conditions narrowly.
6. Add permission boundaries for delegated administration where needed.
7. Test with policy simulator or controlled execution.
8. Monitor CloudTrail and Access Analyzer for unexpected access.
9. Remove unused permissions after observation.

## Decision points
Use resource policies for resource-owner control and identity policies for principal capabilities. Use explicit deny for non-negotiable boundaries, cautiously.

## Common failure patterns
AdministratorAccess by default, wildcard resources, static keys in CI, circular role chains, broad sts:AssumeRole, missing MFA for privileged humans, and confusing trust with permissions.

## Verification
Prove allowed tasks succeed, denied tasks fail, cross-account assumptions are traceable, and no static credentials are introduced.

## Expected output
Minimal IAM roles and policies, trust model, validation evidence, and access-review notes.

## Stop conditions
Escalate when exact required permissions cannot be determined, privileged production access lacks approval, or policy changes risk lockout.