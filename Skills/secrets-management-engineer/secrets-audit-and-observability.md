# Secrets Audit and Observability

## Purpose
Make secret access and lifecycle operations observable enough to detect abuse, diagnose failures, and provide defensible audit evidence without logging secret values.

## When to use
Use when onboarding a secret store, designing monitoring, preparing audits, or investigating suspicious access.

## Inputs
- Secret-store audit capabilities
- Identity and workload metadata
- Logging and SIEM architecture
- SLOs and compliance requirements

## Context to inspect
Inspect audit events, authentication logs, policy changes, lease issuance, reads, writes, rotations, revocations, administrative actions, replication health, and alert routing.

## Core knowledge
Useful telemetry answers who, what, when, where, and outcome while avoiding plaintext. High-value signals include unusual read volume, first-time access, cross-environment access, disabled audit sinks, policy changes, failed authentication spikes, and stale rotations.

## Procedure
1. Enumerate security and operational events required for investigation.
2. Enable tamper-resistant audit logging on authoritative stores.
3. Normalize identity, workload, secret path, action, result, and correlation metadata.
4. Redact values and sensitive payload fields at source.
5. Forward logs to a protected central platform.
6. Define metrics for availability, latency, renewal, rotation, expiry, and policy failures.
7. Create alerts for high-confidence misuse and control degradation.
8. Build dashboards for operational health and lifecycle risk.
9. Test alert routing and retention.
10. Periodically validate that audit pipelines themselves remain active.

## Decision points
Alert immediately on high-impact administrative changes and suspicious privileged reads; aggregate noisy low-risk events. Retain metadata according to investigative and regulatory needs, not indefinitely by default.

## Common failure patterns
- Logging secret values for debugging
- Audit logs writable by the same administrators being audited
- Alerts without ownership
- Metrics showing store health but not secret lifecycle failures
- Missing correlation between workload identity and secret access

## Verification
Generate controlled test events and confirm they appear with correct identity, action, result, alerting, and retention while no secret values are captured.

## Expected output
A monitored secrets platform with protected audit trails, actionable alerts, operational metrics, and validated evidence quality.

## Stop conditions
Stop if enabling telemetry could expose plaintext, audit storage is not sufficiently protected, or required identity attribution is unavailable.