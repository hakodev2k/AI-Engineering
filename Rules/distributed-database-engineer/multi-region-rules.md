# Multi-Region Database Rules

## Purpose
Make geographic distribution deliberate with explicit latency, consistency, sovereignty, and failure trade-offs.

## Scope
Regional placement, geo-replication, active-active, active-passive, and locality-aware routing.

## MUST
- Region topology MUST document write locations, quorum behavior, latency impact, residency constraints, and regional failure semantics.
- Cross-region synchronous coordination MUST be justified against latency and availability objectives.
- Active-active writes MUST define deterministic conflict prevention or resolution.
- Regional evacuation MUST have tested routing and data-readiness procedures.

## MUST NOT
- MUST NOT assume adding regions automatically improves availability.
- MUST NOT place regulated data in prohibited regions.
- MUST NOT permit stale regional replicas to become writers without safety checks.

## SHOULD
- Data and compute SHOULD be colocated for dominant access patterns when consistent with resilience requirements.

## Exceptions
Unusual placement requires documented constraints, risk, and operational evidence.

## Verification
Use topology inspection, latency tests, regional failure drills, residency audits, and replication telemetry.