# AI Infrastructure Security

## Purpose
Protect accelerator clusters, model-serving systems, training jobs, artifacts, and data paths while preserving platform usability and performance.

## When to use
Use for architecture reviews, new shared clusters, external model/data access, or security remediation.

## Inputs
Trust boundaries, identities, network paths, artifact sources, secrets, data sensitivity, platform APIs.

## Context to inspect
IAM, workload identity, node permissions, container privileges, network policies, registry controls, secrets, egress, audit logs, and tenant isolation.

## Core knowledge
AI infrastructure combines high-value models/data with privileged device access and large shared compute. Security requires least privilege, provenance, isolation, controlled egress, secure images, and auditable operations.

## Procedure
1. Map assets, actors, and trust boundaries.
2. Identify privileged control-plane and device-access paths.
3. Enforce workload identity instead of long-lived credentials.
4. Restrict container privileges and host access.
5. Apply network segmentation and egress controls.
6. Verify artifact provenance and image scanning.
7. Protect secrets and rotate exposed credentials.
8. Define tenant isolation and data-access boundaries.
9. Enable audit logging for administrative and deployment actions.
10. Test abuse cases and recovery procedures.

## Decision points
Use stronger isolation for untrusted or cross-tenant workloads even when it reduces utilization. Permit internet egress only when operationally justified.

## Common failure patterns
Shared static tokens, privileged pods by default, unrestricted egress, unsigned artifacts, secrets in environment dumps, and excessive cluster-admin access.

## Verification
Validate IAM denial cases, network-policy tests, image controls, secret handling, and audit coverage.

## Expected output
A threat-informed security baseline and remediation plan.

## Stop conditions
Stop when security-sensitive changes require approvals or access beyond the operator's authority.