# Site Reliability Engineer Rules

Operating constraints for AI-assisted work performed in the Site Reliability Engineer discipline. These files are policy guidance, require no installation, and should be combined with repository-specific instructions and deterministic checks.

Each rule file is self-contained and may be copied independently; this README and the sibling rules are navigation and optional context, not runtime dependencies.

## Usage

1. Select the smallest set of rules that covers the planned change.
2. Resolve conflicts using repository policy, explicit approval boundaries, and the stricter safety requirement.
3. Where available, optionally pair the rules with matching SRE procedures.
4. Convert critical requirements into tests, hooks, or CI checks in the target repository.

## Catalogue

- [Automation and Toil Rules](automation-toil-rules.md)
- [Capacity Planning Rules](capacity-planning-rules.md)
- [Change Management Rules](change-management-rules.md)
- [Configuration Rules](configuration-rules.md)
- [Data Durability and Backup Rules](data-durability-backup-rules.md)
- [Dependency Reliability Rules](dependency-reliability-rules.md)
- [Deployment and Rollback Rules](deployment-rollback-rules.md)
- [Disaster Recovery Rules](disaster-recovery-rules.md)
- [Error Budget Rules](error-budget-rules.md)
- [Incident Response Rules](incident-response-rules.md)
- [Infrastructure as Code Rules](infrastructure-as-code-rules.md)
- [Kubernetes Reliability Rules](kubernetes-reliability-rules.md)
- [Monitoring and Alerting Rules](monitoring-alerting-rules.md)
- [Observability Rules](observability-rules.md)
- [On-Call Rules](on-call-rules.md)
- [Performance Rules](performance-rules.md)
- [Postmortem Rules](postmortem-rules.md)
- [Reliability Architecture Rules](reliability-architecture-rules.md)
- [Resilience Pattern Rules](resilience-pattern-rules.md)
- [Security Rules](security-rules.md)
- [SLO and SLI Rules](slo-sli-rules.md)

## Maintenance

When adding a rule, keep it focused, link it from this index, preserve the surrounding terminology, and document verification and approval boundaries. Follow the host repository's contribution policy when one exists.
