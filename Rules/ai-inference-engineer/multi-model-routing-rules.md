# Multi-Model Routing Rules

## Purpose
Route inference requests to the correct model, version, hardware pool, and fallback without ambiguity.

## Scope
Model aliases, version selection, traffic splitting, tenant routing, hardware affinity, and fallback chains.

## MUST
- Routing rules MUST resolve to an explicit model version and serving pool.
- Traffic splits MUST be deterministic enough to support measurement and rollback.
- Fallback chains MUST preserve contract compatibility and security boundaries.
- Model aliases MUST have auditable ownership and change history.
- Routing changes MUST include validation of expected traffic distribution.

## MUST NOT
- MUST NOT route requests to an incompatible model solely because capacity is available.
- MUST NOT let fallback silently change output schema or materially different safety constraints.
- MUST NOT create routing loops or unbounded fallback chains.

## SHOULD
- Route using immutable deployment identities beneath stable consumer-facing aliases.
- Expose routing decisions in traces or structured logs where privacy permits.

## Exceptions
Emergency routing requires bounded scope, explicit owner, rollback criteria, and post-change review.

## Verification
Inspect routing configuration, distribution tests, trace samples, fallback tests, and alias history.