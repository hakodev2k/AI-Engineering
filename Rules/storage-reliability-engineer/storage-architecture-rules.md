# Storage Architecture Rules

## Purpose
Protect storage architecture decisions from hidden durability, scale, and operational failure modes.

## Scope
Applies to persistent storage services, block/file/object systems, and storage control planes.

## MUST
- Define durability, availability, latency, throughput, recovery, and capacity objectives before selecting architecture.
- Document failure domains, replication boundaries, ownership, and data movement paths.
- Validate architecture against expected growth and degraded-mode behavior.

## MUST NOT
- Treat vendor defaults as sufficient design evidence.
- Introduce a single hidden failure domain for critical data.
- Approve architecture changes without rollback or recovery analysis.

## SHOULD
- Prefer simple, observable architectures with explicit failure semantics.
- Record material trade-offs in an architecture decision record.

## Exceptions
Exceptions require documented constraints, evidence, risk, mitigation, and accountable approval.

## Verification
Review diagrams, ADRs, resilience tests, capacity models, and production telemetry.