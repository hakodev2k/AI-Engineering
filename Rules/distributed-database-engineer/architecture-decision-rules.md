# Architecture Decision Rules

## Purpose
Ensure consequential database choices are traceable to requirements, evidence, and explicit trade-offs.

## Scope
Database selection, topology, consistency, partitioning, storage engines, migrations, and major architectural changes.

## MUST
- Significant decisions MUST document requirements, constraints, alternatives, trade-offs, failure implications, and reversibility.
- Technology selection MUST be based on workload and operational needs rather than popularity or familiarity alone.
- Irreversible or high-migration-cost choices MUST receive proportionately stronger evidence and review.
- Assumptions that materially affect design MUST be testable or explicitly tracked.

## MUST NOT
- MUST NOT present agent confidence, vendor claims, or benchmarks from dissimilar workloads as sufficient evidence.
- MUST NOT hide operational complexity when comparing alternatives.

## SHOULD
- Decisions SHOULD prefer reversible paths under high uncertainty.

## Exceptions
Urgent provisional decisions require an owner, expiry/review date, and documented risk.

## Verification
Review decision records, prototypes, benchmarks, requirement traceability, and approval evidence.