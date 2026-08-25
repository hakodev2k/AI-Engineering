# Topology and Architecture Rules

## Purpose
Keep streaming architectures evolvable, comprehensible, and aligned with ownership boundaries.

## Scope
Applies to producers, streams, processors, sinks, derived streams, joins, fan-out, and domain boundaries.

## MUST
- Each stream MUST have a clear ownership boundary and authoritative meaning.
- Processing topology MUST make material stateful, repartitioning, join, and side-effect stages explicit.
- Derived streams MUST document lineage and whether they are rebuildable from retained authoritative inputs.
- Cross-domain event dependencies MUST use published contracts rather than internal database or implementation coupling.
- Significant topology changes MUST document trade-offs in latency, consistency, operability, cost, and failure behavior.

## MUST NOT
- MUST NOT use an event bus as an ungoverned substitute for service boundaries.
- MUST NOT create cyclic event dependencies without explicit convergence and failure analysis.
- MUST NOT publish database change records as stable business contracts unless their semantics and ownership are intentionally governed.
- MUST NOT add fan-out consumers without considering retention, capacity, security, and contract ownership.

## SHOULD
- Topologies SHOULD favor independently deployable stages with observable contracts.
- Rebuildable derived data SHOULD remain reproducible from authoritative sources where practical.

## Exceptions
Tight coupling requires documented constraint, alternative analysis, lifecycle ownership, and exit strategy.

## Verification
Use architecture review, topology diagrams generated or checked against deployment, contract/lineage inspection, dependency analysis, and failure-mode review.