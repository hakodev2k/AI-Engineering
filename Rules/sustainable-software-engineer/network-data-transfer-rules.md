# Network Data Transfer Rules

## Purpose
Reduce unnecessary network transfer, protocol overhead, and cross-boundary data movement while preserving correctness, security, and responsiveness.

## Scope
Applies to service-to-service traffic, APIs, CDN usage, replication, telemetry, batch transfers, client payloads, and inter-region communication.

## MUST
- Material data-transfer paths MUST be observable by volume, frequency, destination, and workload purpose where tooling permits.
- Cross-region and cross-provider transfer MUST be justified by resilience, locality, regulatory, integration, or workload requirements.
- Payload reduction changes MUST preserve contract correctness and required diagnostics.

## MUST NOT
- MUST NOT repeatedly transfer unchanged bulk data when caching, deltas, pagination, or event-driven updates can meet the requirement.
- MUST NOT weaken encryption, authentication, validation, or redundancy solely to reduce transfer overhead.
- MUST NOT move data to a lower-impact region when residency or latency requirements prohibit it.

## SHOULD
- Prefer batching, compression, locality, caching, and selective fields when measurements show material benefit.
- Avoid excessive telemetry cardinality and duplicated exports.

## Exceptions
Exceptions require the transfer requirement, alternatives considered, security and latency constraints, expected volume, and review owner.

## Verification
Inspect network telemetry, egress reports, API payloads, replication topology, CDN/cache statistics, tracing data, and before/after transfer measurements.
