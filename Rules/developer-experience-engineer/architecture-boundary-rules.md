# Architecture Boundary Rules
## Purpose
Keep developer-experience systems modular, supportable, and appropriately decoupled.
## Scope
Developer portals, CLIs, build services, plugins, workflow engines, shared libraries, and integration adapters.
## MUST
- Component boundaries MUST reflect ownership, lifecycle, and failure isolation rather than incidental code layout.
- Core workflow logic MUST be separated from provider-specific integrations where multiple providers or replacement are realistic.
- Significant architecture changes MUST document constraints, alternatives, trade-offs, migration, and operational impact.
- Shared abstractions MUST have demonstrated multiple-consumer value or a clear platform contract.
## MUST NOT
- MUST NOT centralize unrelated workflows into a platform dependency without quantified benefit and failure-impact analysis.
- MUST NOT expose internal persistence or provider details as stable public contracts accidentally.
- MUST NOT introduce cyclic ownership or dependency relationships without explicit review.
## SHOULD
- Boundaries SHOULD make independent testing, deployment, and failure diagnosis easier.
- Simpler architecture SHOULD be preferred when requirements are equivalent.
## Exceptions
Boundary exceptions require rationale, coupling risk, alternatives, owner, and review trigger.
## Verification
Use architecture review, dependency graphs/tests, contract inspection, failure analysis, ownership mapping, and deployment-change review.