# Speech ML Production Observability

## Purpose
Detect speech-system degradation in production while respecting privacy and operational constraints.

## When to use
Use when deploying or operating ASR, TTS, diarization, VAD, or audio ML services.

## Inputs
Service telemetry, model metadata, SLOs, privacy policy, offline evaluation, incident history.

## Context to inspect
Inspect request flow, model versions, audio metadata allowed for logging, latency, errors, confidence, traffic cohorts, and resource saturation.

## Core knowledge
Ground-truth labels are usually delayed or absent in production. Observability therefore combines service metrics, safe input/output proxies, drift signals, sampled evaluation, and user feedback.

## Procedure
1. Define service and model SLOs.
2. Instrument model/version/config identifiers.
3. Track latency, errors, saturation, and throughput.
4. Add privacy-safe quality proxies and distribution metrics.
5. Segment by supported cohorts and acquisition conditions.
6. Establish baselines and actionable alerts.
7. Correlate alerts with deployments and upstream changes.
8. Maintain rollback and offline replay procedures.

## Decision points
Prefer derived metadata over retaining raw audio when it answers the operational question. Alert on user-impacting conditions, not every statistical fluctuation.

## Common failure patterns
Raw-audio logging by default, missing model version tags, noisy alerts, no cohort visibility, and dashboards without rollback criteria.

## Verification
Trigger synthetic faults, confirm dashboards/alerts, and rehearse version rollback using non-sensitive fixtures.

## Expected output
Actionable telemetry and incident-ready runbooks for speech ML behavior.

## Stop conditions
Escalate when required monitoring conflicts with privacy policy or cannot be implemented without sensitive retention.