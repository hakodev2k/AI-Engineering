# Cloud Architecture Rules
## Purpose
Ensure cloud designs are explicit, supportable, secure, and aligned with workload requirements.
## Scope
Cloud topology, service selection, boundaries, dependencies, and architectural change.
## MUST
- Architecture decisions MUST trace to functional requirements, NFRs, constraints, and failure assumptions.
- Critical dependencies MUST have documented ownership, availability expectations, and failure behavior.
- Significant architecture changes MUST document trade-offs, migration impact, rollback strategy, and operational consequences.
## MUST NOT
- MUST NOT select managed services solely from familiarity without evaluating workload fit, lock-in, cost, security, and operations.
- MUST NOT introduce hidden single points of failure into critical paths.
## SHOULD
- Prefer the simplest architecture that satisfies measured reliability, security, performance, and scale requirements.
## Exceptions
Exceptions require documented context, alternatives, risk, evidence, verification, and accountable approval.
## Verification
Review architecture diagrams, decision records, NFR traceability, dependency inventories, failure analysis, and operational readiness evidence.