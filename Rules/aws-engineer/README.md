# AWS Engineer Rules

Standalone, tool-neutral constraints for AI-assisted work in this discipline. Each rule file can be copied independently; this index and sibling rules are optional navigation, not runtime dependencies.

## How to use

1. Select only the rule files relevant to the requested change and its risk.
2. Apply them with the target repository policy, explicit authorization, and the stricter safety requirement.
3. Convert important constraints into target-repository checks when deterministic enforcement is needed.
4. Keep production, destructive, privileged, financial, or externally visible actions behind the target environment's approval process.

## Rule catalogue

- [Backup and Disaster Recovery Rules](backup-disaster-recovery-rules.md)
- [CI/CD and Release Rules](ci-cd-release-rules.md)
- [Compute and Scaling Rules](compute-scaling-rules.md)
- [Container and Kubernetes Rules](container-kubernetes-rules.md)
- [Cost Management Rules](cost-management-rules.md)
- [Database Service Rules](database-service-rules.md)
- [IAM and Access Rules](iam-access-rules.md)
- [Incident Response Rules](incident-response-rules.md)
- [Infrastructure as Code Rules](infrastructure-as-code-rules.md)
- [Messaging and Event Rules](messaging-event-rules.md)
- [Multi-Account Governance Rules](multi-account-governance-rules.md)
- [Network Security Rules](network-security-rules.md)
- [Observability Rules](observability-rules.md)
- [Performance and Capacity Rules](performance-capacity-rules.md)
- [Production Change Rules](production-change-rules.md)
- [Reliability and Availability Rules](reliability-availability-rules.md)
- [Secrets and Key Management Rules](secrets-key-management-rules.md)
- [Security Monitoring Rules](security-monitoring-rules.md)
- [Serverless Rules](serverless-rules.md)
- [AWS Service Selection Rules](service-selection-rules.md)
- [Storage and Data Protection Rules](storage-data-protection-rules.md)
- [Tagging and Resource Ownership Rules](tagging-resource-ownership-rules.md)

## Adoption note

Rules guide behavior but do not grant access, authority, or approval. Use the target repository's policy for ownership, secrets, and external actions.

