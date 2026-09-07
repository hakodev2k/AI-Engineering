# Media Pipeline Architecture Rules

## Purpose
Protect correctness, operability, and evolvability across ingest, processing, packaging, origin, CDN, and playback boundaries.

## Scope
Live and on-demand media pipelines, control planes, data planes, and third-party media services.

## MUST
- Pipeline stages MUST have explicit ownership, inputs, outputs, failure semantics, and latency budgets.
- State transitions MUST be deterministic or externally observable enough to reconcile safely.
- Cross-stage contracts MUST be versioned when independent deployment is possible.
- Architecture changes MUST document effects on latency, quality, reliability, cost, and compatibility.

## MUST NOT
- MUST NOT couple independent stages through undocumented shared state.
- MUST NOT introduce a single failure domain without an explicit availability decision.
- MUST NOT assume upstream media is valid merely because transport succeeded.

## SHOULD
- Data-plane components SHOULD remain horizontally scalable and as stateless as practical.
- Control-plane dependencies SHOULD degrade without unnecessarily interrupting already-running streams.

## Exceptions
Exceptions require documented constraints, alternatives considered, failure impact, evidence, and approval for production-critical trade-offs.

## Verification
Review architecture diagrams, contracts, dependency graphs, failure tests, latency measurements, and production telemetry.