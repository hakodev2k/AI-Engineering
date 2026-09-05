# Training Observability Rules

## Purpose
Make model, data, system, and distributed failures detectable before they waste compute or corrupt conclusions.

## Scope
Metrics, logs, traces/events, dashboards, alerts, run metadata, and health signals for training.

## MUST
- Training MUST expose loss, learning rate, throughput, token counts, step time, data progress, checkpoint status, and resource health at appropriate cadence.
- Distributed runs MUST make rank/node failures, stragglers, communication stalls, and restarts visible.
- Critical anomalies MUST have alerts or automated stop conditions proportional to run cost and risk.
- Telemetry MUST identify the run, configuration, code, data, and checkpoint lineage without exposing secrets or sensitive examples.
- Monitoring gaps during material intervals MUST be documented when interpreting run validity.

## MUST NOT
- MUST NOT rely on a single aggregate metric to determine training health.
- MUST NOT log credentials, raw secrets, or unnecessarily sensitive training samples.
- MUST NOT discard failure telemetry needed for root-cause analysis before the incident is resolved.

## SHOULD
- Dashboards SHOULD correlate model signals with hardware and input-pipeline signals.
- Long runs SHOULD include anomaly baselines for step time, norms, memory, and throughput.

## Exceptions
Short local experiments may use reduced telemetry if failures are cheap and results are not release evidence.

## Verification
Inspect dashboards, alert definitions, run metadata, log redaction, retention, anomaly records, and sampled failure investigations.