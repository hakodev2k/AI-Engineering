# Production Observability and Drift

## Purpose
Make production vision behavior measurable enough to detect quality degradation, data drift, pipeline faults, and capacity problems before they become persistent user impact.

## When to use
Use when deploying or operating a vision model, adding a new capture source, investigating unexplained quality changes, or defining release health gates.

## Inputs
Model and data versions, inference service telemetry, capture metadata, prediction outputs, delayed labels when available, SLOs, privacy constraints, and deployment topology.

## Preconditions
Model, preprocessing, and dataset/model versions can be identified in production requests without exposing sensitive data.

## Context to inspect
Inspect traffic volume, device/camera mix, input dimensions and quality, confidence distributions, class rates, latency stages, errors, resource utilization, queueing, model versions, and label-feedback delay.

## Core knowledge
Operational telemetry is not ground truth. Input statistics, embedding or feature distributions, prediction rates, confidence, and calibration proxies can signal change, but quality drift should be confirmed with labels or targeted review. Monitoring must distinguish application faults from model degradation.

## Procedure
1. Define quality, availability, latency, throughput, and freshness SLOs.
2. Instrument decode, preprocessing, inference, post-processing, and downstream delivery separately.
3. Attach model/preprocessing/runtime versions to telemetry.
4. Monitor input-schema and media-quality anomalies.
5. Track prediction/confidence distributions and critical business slices.
6. Establish baselines by device, environment, geography, or other justified domain dimensions.
7. Define drift alerts using stable windows and minimum-volume guards.
8. Add delayed-label or sampled-review pipelines for actual quality measurement.
9. Correlate alerts with deployments, camera changes, traffic shifts, and infrastructure incidents.
10. Create dashboards and runbooks that lead from symptom to likely subsystem.
11. Test alerts through controlled changes or replayed incidents.
12. Periodically retire noisy signals and update baselines after approved domain changes.

## Decision points
Use raw-pixel or metadata statistics for acquisition faults, feature/embedding signals for representation shift, and label-based metrics for confirmed quality. Do not trigger retraining from drift alone when the drift is benign.

## Common failure patterns
Monitoring only service uptime, alerting on confidence without volume controls, collecting sensitive images unnecessarily, mixing model versions in dashboards, and automatically retraining on every distribution change.

## Verification
Verify telemetry completeness, version attribution, alert tests, dashboard slice correctness, label-feedback measurements, and incident runbook execution.

## Expected output
A production observability system with SLOs, dashboards, drift/quality signals, alerts, runbooks, and privacy-aware evidence collection.

## Stop conditions
Stop and escalate if required monitoring would violate privacy policy, labels are unavailable for a safety-critical quality claim, or telemetry cannot distinguish model versions reliably.