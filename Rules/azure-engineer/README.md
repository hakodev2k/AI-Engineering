# Azure Engineer Rules

Standalone, tool-neutral constraints for AI-assisted work in this discipline. Each rule file can be copied independently; this index and sibling rules are optional navigation, not runtime dependencies.

## How to use

1. Select only the rule files relevant to the requested change and its risk.
2. Apply them with the target repository policy, explicit authorization, and the stricter safety requirement.
3. Convert important constraints into target-repository checks when deterministic enforcement is needed.
4. Keep production, destructive, privileged, financial, or externally visible actions behind the target environment's approval process.

## Rule catalogue

- [Backup and Recovery Rules](backup-recovery-rules.md)
- [CI/CD and Release Rules](cicd-release-rules.md)
- [Compliance and Audit Rules](compliance-audit-rules.md)
- [Compute Platform Rules](compute-platform-rules.md)
- [Cost Management Rules](cost-management-rules.md)
- [Database Service Rules](database-service-rules.md)
- [Disaster Recovery Rules](disaster-recovery-rules.md)
- [Environment Separation Rules](environment-separation-rules.md)
- [Identity and Access Rules](identity-access-rules.md)
- [Incident Response Rules](incident-response-rules.md)
- [Infrastructure as Code Rules](infrastructure-as-code-rules.md)
- [Messaging and Integration Rules](messaging-integration-rules.md)
- [Network Security Rules](network-security-rules.md)
- [Observability and Monitoring Rules](observability-monitoring-rules.md)
- [Performance and Capacity Rules](performance-capacity-rules.md)
- [Production Change Rules](production-change-rules.md)
- [Reliability and Availability Rules](reliability-availability-rules.md)
- [Resource Governance Rules](resource-governance-rules.md)
- [Secrets and Key Management Rules](secrets-key-management-rules.md)
- [Security Posture Rules](security-posture-rules.md)
- [Azure Service Selection Rules](service-selection-rules.md)
- [Storage and Data Protection Rules](storage-data-protection-rules.md)

## Adoption note

Rules guide behavior but do not grant access, authority, or approval. Use the target repository's policy for ownership, secrets, and external actions.

