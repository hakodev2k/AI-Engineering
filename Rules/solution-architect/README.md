# Solution Architect Rules

Operating constraints for AI-assisted work performed in the Solution Architect discipline. These files are policy guidance, require no installation, and should be combined with repository-specific instructions and deterministic checks.

Each rule file is self-contained and may be copied independently; this README and the sibling rules are navigation and optional context, not runtime dependencies.

## Usage

1. Select the smallest set of rules that covers the planned change.
2. Resolve conflicts using repository policy, explicit approval boundaries, and the stricter safety requirement.
3. Where available, optionally pair the rules with matching solution architecture procedures.
4. Convert critical requirements into tests, hooks, or CI checks in the target repository.

## Catalogue

- [API Contract Rules](api-contract-rules.md)
- [Architecture Decision Rules](architecture-decision-rules.md)
- [Architecture Review and Governance Rules](architecture-review-governance-rules.md)
- [Availability and Resilience Rules](availability-resilience-rules.md)
- [Cloud and Infrastructure Rules](cloud-infrastructure-rules.md)
- [Cost Architecture Rules](cost-architecture-rules.md)
- [Data Consistency Rules](data-consistency-rules.md)
- [Data Ownership Rules](data-ownership-rules.md)
- [Deployment and Release Rules](deployment-release-rules.md)
- [Identity and Access Rules](identity-access-rules.md)
- [Integration Architecture Rules](integration-architecture-rules.md)
- [Migration and Modernization Rules](migration-modernization-rules.md)
- [Non-Functional Requirement Rules](non-functional-requirement-rules.md)
- [Observability Rules](observability-rules.md)
- [Operational Readiness Rules](operational-readiness-rules.md)
- [Privacy and Compliance Rules](privacy-compliance-rules.md)
- [Reliability Rules](reliability-rules.md)
- [Requirement Traceability Rules](requirement-traceability-rules.md)
- [Scalability and Performance Rules](scalability-performance-rules.md)
- [Security Architecture Rules](security-architecture-rules.md)
- [System Boundary Rules](system-boundary-rules.md)
- [Technical Communication Rules](technical-communication-rules.md)
- [Vendor and Third-Party Rules](vendor-third-party-rules.md)

## Maintenance

When adding a rule, keep it focused, link it from this index, preserve the surrounding terminology, and document verification and approval boundaries. Follow the host repository's contribution policy when one exists.
