# Warehouse Architecture Rules

## Purpose
Protect scalable, maintainable analytical architecture and clear system boundaries.

## Scope
Applies to warehouse platforms, marts, semantic layers, ingestion boundaries, and analytical serving patterns.

## MUST
- Architectural changes MUST identify source systems, ownership boundaries, latency targets, retention needs, and downstream consumers.
- Core warehouse layers MUST have explicit responsibilities and MUST avoid circular dependencies.
- Shared dimensions and conformed entities MUST have a documented owner and compatibility policy.
- Significant topology changes MUST document migration, rollback, and cost impact.

## MUST NOT
- MUST NOT couple consumer-specific presentation logic directly into raw ingestion layers.
- MUST NOT introduce a new architectural layer without a clear responsibility and measurable benefit.

## SHOULD
- Prefer simple, inspectable data flows over hidden framework behavior.
- Prefer reversible migration paths when replacing critical warehouse components.

## Exceptions
Exceptions require rationale, alternatives considered, operational risk, and reviewer approval.

## Verification
Inspect architecture diagrams, dependency graphs, lineage, migration plans, and design-review evidence.