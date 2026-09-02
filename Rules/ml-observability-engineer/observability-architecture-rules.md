# Observability Architecture

## Purpose
Define reliable observability architecture for production machine-learning systems so model, data, inference, and platform failures can be detected and diagnosed with evidence.

## Scope
Applies to telemetry design, monitoring topology, ownership, retention, correlation, and operational interfaces for ML systems.

## MUST
- Observability architecture MUST cover model behavior, data health, inference service health, and supporting infrastructure where each can affect user outcomes.
- Every production-critical signal MUST have a documented owner, collection path, retention policy, and failure behavior.
- Telemetry MUST support correlation between model version, dataset or feature version, deployment, request cohort, and relevant runtime context.
- Monitoring dependencies MUST be designed so loss of telemetry is itself detectable.

## MUST NOT
- MUST NOT treat infrastructure uptime as evidence that model behavior is healthy.
- MUST NOT create monitoring that depends on undocumented manual interpretation for critical failure detection.
- MUST NOT make production decisions from signals whose provenance or semantics are unknown.

## SHOULD
- Prefer a small set of well-defined canonical signals over redundant dashboards with inconsistent semantics.
- Prefer architecture that preserves cross-service correlation without exposing sensitive payloads.

## Exceptions
Exceptions require documented context, risk, alternative considered, evidence, verification method, and accountable approval when production detection coverage is reduced.

## Verification
Review telemetry schemas, ownership records, dependency diagrams, retention settings, failure-injection evidence, and production incident examples showing end-to-end correlation.