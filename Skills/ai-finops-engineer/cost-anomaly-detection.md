# Cost Anomaly Detection

## Purpose
Detect and triage abnormal AI spending quickly enough to prevent runaway cost while avoiding noisy alerts that teams learn to ignore.

## When to use
Use for GPU fleets, usage-based model APIs, vector databases, data pipelines, or any AI service with variable consumption.

## Inputs
- Billing and usage telemetry
- Historical baselines
- Ownership metadata
- Deployment and experiment events
- Budget thresholds

## Context to inspect
Inspect model changes, traffic spikes, retry storms, autoscaling events, orphaned jobs, failed training loops, new tenants, provider price changes, and data-volume growth.

## Core knowledge
Cost anomalies can be absolute, rate-based, ratio-based, or contextual. Useful detection considers expected workload behavior and should connect financial signals to operational telemetry.

## Procedure
1. Define monitored cost dimensions and owners.
2. Establish baselines by workload, model, environment, and time pattern.
3. Add absolute guardrails for catastrophic spend.
4. Add relative and rate-of-change detectors for subtler anomalies.
5. Suppress known planned events where appropriate.
6. Attach likely operational causes and ownership metadata to alerts.
7. Route alerts according to severity and actionability.
8. Investigate top anomalies by cost delta and persistence.
9. Remediate the underlying workload or control failure.
10. Tune thresholds using false-positive and missed-incident evidence.
11. Record incident savings and detection latency.

## Decision points
Use hard automated shutdown only for clearly non-critical or explicitly governed workloads. Prefer human confirmation for ambiguous production anomalies.

## Common failure patterns
Static thresholds on seasonal workloads, alerts without ownership, using invoice data too late for intervention, and treating legitimate product growth as waste.

## Verification
Confirm test anomalies trigger expected alerts, ownership is correct, and detection occurs within the required response window. Review false-positive rate regularly.

## Expected output
An anomaly detection policy, alert routing, investigation playbook, and measured detection performance.

## Stop conditions
Stop if source telemetry is materially delayed or incomplete, or if automated remediation could interrupt critical production without approved safeguards.