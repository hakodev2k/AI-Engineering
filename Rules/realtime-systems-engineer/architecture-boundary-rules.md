# Architecture Boundary Rules

## Purpose
Keep timing-critical responsibilities isolated, analyzable, and resistant to accidental coupling.

## Scope
Modules, processes, cores, partitions, services, shared resources, and dependency direction.

## MUST
- Timing-critical components MUST expose explicit contracts for latency, blocking, resource use, and failure behavior.
- Dependencies from high-criticality code to lower-assurance components MUST be bounded and isolated where failure could violate deadlines or safety.
- Shared resources that cross criticality boundaries MUST have an arbitration and ownership policy.
- Architecture changes affecting task topology or dependency direction MUST reassess timing assumptions.

## MUST NOT
- MUST NOT hide unbounded work behind an abstraction used by hard real-time code.
- MUST NOT create cyclic runtime dependencies that make fault containment or startup ordering indeterminate.

## SHOULD
- Prefer partitioning that makes timing and resource ownership locally reasoned about.

## Exceptions
Exceptions require documented coupling rationale, bounded behavior, and review.

## Verification
Use architecture review, dependency analysis, interface inspection, timing tests, and fault-containment tests.