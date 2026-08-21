# DevOps Engineer Rules

Operating constraints for AI-assisted work performed in the DevOps Engineer discipline. These files are policy guidance, require no installation, and should be combined with repository-specific instructions and deterministic checks.

Each rule file is self-contained and may be copied independently; this README and the sibling rules are navigation and optional context, not runtime dependencies.

## Usage

1. Select the smallest set of rules that covers the planned change.
2. Resolve conflicts using repository policy, explicit approval boundaries, and the stricter safety requirement.
3. Where available, optionally pair the rules with matching DevOps engineering procedures.
4. Convert critical requirements into tests, hooks, or CI checks in the target repository.

## Catalogue

- [Alerting Rules](alerting-rules.md)
- [Backup and Recovery Rules](backup-recovery-rules.md)
- [Capacity and Performance Rules](capacity-performance-rules.md)
- [CD and Deployment Rules](cd-deployment-rules.md)
- [Change Governance Rules](change-governance-rules.md)
- [CI Pipeline Rules](ci-pipeline-rules.md)
- [Code Review Rules](code-review-rules.md)
- [Configuration Management Rules](configuration-management-rules.md)
- [Container Image Rules](container-image-rules.md)
- [Cost Governance Rules](cost-governance-rules.md)
- [Disaster Recovery Rules](disaster-recovery-rules.md)
- [Environment Separation Rules](environment-separation-rules.md)
- [Identity and Access Rules](identity-access-rules.md)
- [Incident Response Rules](incident-response-rules.md)
- [Infrastructure as Code Rules](infrastructure-as-code-rules.md)
- [Kubernetes Rules](kubernetes-rules.md)
- [Networking Rules](networking-rules.md)
- [Observability Rules](observability-rules.md)
- [Production Safety Rules](production-safety-rules.md)
- [Secrets Management Rules](secrets-management-rules.md)
- [Security Hardening Rules](security-hardening-rules.md)
- [Supply Chain Rules](supply-chain-rules.md)

## Maintenance

When adding a rule, keep it focused, link it from this index, preserve the surrounding terminology, and document verification and approval boundaries. Follow the host repository's contribution policy when one exists.
