# Database Architecture Principles

## Purpose
Establish durable architectural constraints for database platforms and data-bearing services.

## Scope
Applies to selection, topology, ownership, lifecycle, and evolution of operational databases.

## MUST
- Database architecture MUST derive from documented workload, availability, consistency, recovery, security, compliance, and growth requirements.
- Major technology choices MUST document trade-offs, failure modes, operational ownership, and exit strategy.
- Architecture MUST define authoritative data stores and ownership boundaries.
- Critical decisions MUST record assumptions that can be revalidated later.

## MUST NOT
- MUST NOT select a database primarily from team familiarity or trend without workload evidence.
- MUST NOT create shared-database coupling across domains without explicit ownership and change controls.
- MUST NOT claim resilience, scalability, or consistency guarantees stronger than the implemented platform provides.

## SHOULD
- Prefer the simplest architecture that satisfies current and credible near-term requirements.
- Prefer reversible choices when requirements are uncertain.

## Exceptions
Exceptions require documented context, alternatives considered, risk, evidence, rollback approach, and approval from accountable technical owners.

## Verification
Review architecture decision records, topology diagrams, requirement traceability, failure-mode analysis, and production evidence against stated guarantees.
