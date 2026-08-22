# Software Architect Rules

Operating constraints for AI-assisted work performed in the Software Architect discipline. These files are policy guidance, require no installation, and should be combined with repository-specific instructions and deterministic checks.

Each rule file is self-contained and may be copied independently; this README and the sibling rules are navigation and optional context, not runtime dependencies.

## Usage

1. Select the smallest set of rules that covers the planned change.
2. Resolve conflicts using repository policy, explicit approval boundaries, and the stricter safety requirement.
3. Where available, optionally pair the rules with matching software architecture procedures.
4. Convert critical requirements into tests, hooks, or CI checks in the target repository.

## Catalogue

- [API Contract Rules](api-contract-rules.md)
- [Architecture Decision Record Rules](architecture-decision-record-rules.md)
- [Architecture Principles Rules](architecture-principles-rules.md)
- [Code Review Governance Rules](code-review-governance-rules.md)
- [Configuration and Environment Rules](configuration-environment-rules.md)
- [Data Ownership Rules](data-ownership-rules.md)
- [Dependency Governance Rules](dependency-governance-rules.md)
- [Deployment and Evolution Rules](deployment-evolution-rules.md)
- [Domain Modeling Rules](domain-modeling-rules.md)
- [Integration Pattern Rules](integration-pattern-rules.md)
- [Maintainability and Evolution Rules](maintainability-evolution-rules.md)
- [Migration Strategy Rules](migration-strategy-rules.md)
- [Module Boundary Rules](module-boundary-rules.md)
- [Observability Rules](observability-rules.md)
- [Performance Architecture Rules](performance-architecture-rules.md)
- [Production Safety Rules](production-safety-rules.md)
- [Reliability and Resilience Rules](reliability-resilience-rules.md)
- [Security Architecture Rules](security-architecture-rules.md)
- [Testing Strategy Rules](testing-strategy-rules.md)
- [Transaction and Consistency Rules](transaction-consistency-rules.md)

## Maintenance

When adding a rule, keep it focused, link it from this index, preserve the surrounding terminology, and document verification and approval boundaries. Follow the host repository's contribution policy when one exists.
