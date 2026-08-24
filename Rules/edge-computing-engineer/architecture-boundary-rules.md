# Architecture Boundaries
## Purpose
Keep edge systems evolvable by making ownership and dependency direction explicit.
## Scope
Modules, local services, cloud services, protocols, and data ownership.
## MUST
- Each authoritative data domain MUST have a clear owner.
- Cross-boundary contracts MUST be explicit, versioned where needed, and independently testable.
- Significant architecture changes MUST record constraints, alternatives, trade-offs, and operational consequences.
## MUST NOT
- MUST NOT create hidden coupling through shared mutable storage or undocumented side channels.
- MUST NOT bypass domain ownership to solve a local implementation shortcut.
## SHOULD
- Boundaries SHOULD isolate hardware-specific concerns from portable domain logic where feasible.
## Exceptions
Intentional coupling requires documented benefit, lifecycle ownership, and verification strategy.
## Verification
Use architecture review, dependency analysis, contract tests, data-flow inspection, and ADR review.