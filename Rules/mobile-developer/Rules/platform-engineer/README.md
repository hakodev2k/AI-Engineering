# Platform Engineer Rules

Operating constraints for AI-assisted work performed in the Platform Engineer discipline. These files are policy guidance, require no installation, and should be combined with repository-specific instructions and deterministic checks.

Each rule file is self-contained and may be copied independently; this README and the sibling rules are navigation and optional context, not runtime dependencies.

## Usage

1. Select the smallest set of rules that covers the planned change.
2. Resolve conflicts using repository policy, explicit approval boundaries, and the stricter safety requirement.
3. Where available, optionally pair the rules with relevant platform, DevOps, SRE, or security procedures.
4. Convert critical requirements into tests, hooks, or CI checks in the target repository.

## Catalogue

- [Capacity and Cost Rules](capacity-cost-rules.md)
- [Container Runtime Rules](container-runtime-rules.md)
- [Data Protection Rules](data-protection-rules.md)
- [Developer Experience Rules](developer-experience-rules.md)
- [Golden Path Rules](golden-path-rules.md)
- [Identity and Access Rules](identity-access-rules.md)
- [Platform Incident Response Rules](incident-response-rules.md)
- [Infrastructure Provisioning Rules](infrastructure-provisioning-rules.md)
- [Kubernetes Platform Rules](kubernetes-platform-rules.md)
- [Multi-Tenancy Rules](multi-tenancy-rules.md)
- [Observability Platform Rules](observability-platform-rules.md)
- [Platform API Rules](platform-api-rules.md)
- [Platform Testing Rules](platform-testing-rules.md)
- [Platform Upgrade Rules](platform-upgrade-rules.md)
- [Policy as Code Rules](policy-as-code-rules.md)
- [Platform Reliability Rules](reliability-rules.md)
- [Secrets Management Rules](secrets-management-rules.md)
- [Self-Service Rules](self-service-rules.md)
- [Service Catalog Rules](service-catalog-rules.md)
- [Supply Chain Security Rules](supply-chain-security-rules.md)

## Maintenance

When adding a rule, keep it focused, link it from this index, preserve the surrounding terminology, and document verification and approval boundaries. Follow the host repository's contribution policy when one exists.
