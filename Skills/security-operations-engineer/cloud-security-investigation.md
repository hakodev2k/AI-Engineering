# Cloud Security Investigation

## Purpose
Investigate suspicious cloud control-plane and workload activity with correct identity, resource and API context.

## When to use
Use for anomalous API calls, key abuse, public exposure, privilege escalation, workload compromise or security-control changes.

## Inputs
Cloud audit logs, IAM events, resource inventory, network flow, workload logs, key/token metadata and configuration history.

## Context to inspect
Map accounts/subscriptions/projects, organizations, federation, regions, resource hierarchy, logging coverage and automation identities.

## Core knowledge
Cloud attacks often use legitimate APIs and short-lived credentials. Control-plane history and identity provenance are essential; resource deletion can erase evidence.

## Procedure
1. Identify principal, credential type and resource scope.
2. Reconstruct API timeline and source context.
3. Inspect role assumptions, policy changes and credential creation.
4. Review network/security-control modifications.
5. Examine affected workloads and data access.
6. Search organization-wide for matching behavior.
7. Preserve configuration and audit evidence.
8. Disable or constrain compromised credentials.
9. Restore secure configuration through controlled change.
10. Validate no persistence remains.

## Decision points
Quarantine resources rather than delete when evidence matters. Rotate keys when compromise is plausible; redesign long-lived credentials when they caused exposure.

## Common failure patterns
Looking only at workload logs; deleting resources too early; missing cross-account role chains; treating automation as automatically benign.

## Verification
Confirm principal containment, policy restoration, persistence search, data-access scope and post-remediation monitoring.

## Expected output
Cloud incident assessment with API timeline, affected resources, identity chain and remediation evidence.

## Stop conditions
Escalate for organization/root compromise, destructive activity, regulated data exposure or insufficient audit retention.