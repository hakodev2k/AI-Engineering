# SOC Access and Secrets Hygiene

## Purpose
Protect the privileged tools, credentials and evidence repositories used by security operations from becoming attacker leverage.

## When to use
Use when designing SOC access, onboarding analysts, integrating automation or reviewing privileged operations.

## Inputs
Tool inventory, roles, service accounts, API tokens, evidence stores, identity provider policies and access logs.

## Context to inspect
Map administrative capabilities, emergency access, third-party integrations, secret storage, session controls and analyst endpoint posture.

## Core knowledge
Security tooling is a high-value target. Least privilege, phishing-resistant authentication, separation of duties, short-lived credentials and auditable access reduce blast radius.

## Procedure
1. Inventory SOC tools and privileged actions.
2. Map human and machine identities to required capabilities.
3. Remove shared accounts and unnecessary standing privilege.
4. Enforce strong MFA and managed-device requirements where supported.
5. Store secrets in approved secret managers.
6. Prefer workload identity or short-lived tokens to static keys.
7. Restrict evidence repositories by case sensitivity and role.
8. Log privileged actions and secret access.
9. Test break-glass procedures and rotate emergency credentials.
10. Review access periodically and on role change.
11. Revoke stale integrations and tokens.

## Decision points
Use just-in-time elevation when operational latency is acceptable; retain tightly controlled emergency access for outage scenarios.

## Common failure patterns
Tokens in playbooks; shared admin accounts; SOC browser sessions on unmanaged devices; overprivileged SOAR identities; forgotten vendor integrations.

## Verification
Audit effective permissions, authentication controls, secret locations, privileged logs and revocation behavior.

## Expected output
Documented SOC access model with least privilege, secret governance and auditable emergency access.

## Stop conditions
Escalate immediately if privileged SOC credentials are suspected compromised or required controls cannot be enforced.