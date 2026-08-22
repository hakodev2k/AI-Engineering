# Cloud Security Review

## Purpose
Assess cloud deployments for identity, network, data, configuration, resilience, and service-exposure risks.

## When to use
Use for new cloud workloads, major infrastructure changes, managed-service adoption, account/subscription reviews, or after cloud security incidents.

## Inputs
Cloud architecture, IAM policies, network topology, resource inventory, logging configuration, encryption settings, IaC, data classification.

## Context to inspect
Public endpoints, security groups/firewalls, workload identities, key vaults, storage permissions, managed databases, logging, backups, cross-account trust, and deployment pipelines.

## Core knowledge
Cloud security failures frequently come from excessive IAM, public exposure, weak defaults, metadata/service identity abuse, insecure storage, and configuration drift. Managed services still require secure configuration and lifecycle governance.

## Procedure
1. Inventory externally reachable and sensitive resources.
2. Review IAM assignments for least privilege and separation of duties.
3. Validate network segmentation and public exposure.
4. Inspect secrets, keys, certificates, and workload identity usage.
5. Verify storage/database encryption and access policies.
6. Review logging, alerting, audit retention, and security monitoring.
7. Compare deployed resources with IaC and approved baselines.
8. Check backups, recovery paths, and deletion protections for critical assets.
9. Review cross-account/tenant trust and third-party access.
10. Prioritize findings by exploitability, blast radius, and business impact.

## Decision points
Prefer managed identity and private connectivity where they meaningfully reduce risk. Public exposure can be acceptable when intentionally hardened and monitored.

## Common failure patterns
Wildcard IAM, public storage, open management ports, long-lived access keys, disabled audit logs, shadow resources outside IaC, and assuming provider defaults are sufficient.

## Verification
Validate high-risk configuration with provider-native evidence, least-privilege tests, exposure checks, and infrastructure drift detection.

## Expected output
A cloud-security findings set with evidence, remediation priorities, ownership, and verification steps.

## Stop conditions
Escalate when assessment requires privileged access not granted, production changes, or provider/account ownership is unclear.