# Observability and Operational Telemetry

## Purpose
Instrument Salesforce applications so failures, latency, async jobs, integrations, and business-critical workflows can be diagnosed without relying on ad hoc debug logs.

## When to use
Use for production features, integrations, scheduled/async processing, incident-prone workflows, and operational readiness reviews.

## Inputs
Critical journeys, failure modes, logs, eventing options, external monitoring, correlation strategy, support requirements.

## Context to inspect
Debug logging, custom logging objects/events, platform events, transaction IDs, integration correlation IDs, async job records, external APM/SIEM connections.

## Core knowledge
Salesforce debug logs are temporary diagnostic evidence, not a durable observability strategy. Telemetry should expose outcome, latency, volume, failure class, and correlation while avoiding secrets and sensitive data.

## Procedure
1. Identify critical user and system journeys.
2. Define actionable signals for success, failure, latency, and backlog.
3. Establish correlation IDs across Apex, async jobs, and external calls.
4. Emit structured, bounded telemetry at meaningful boundaries.
5. Redact secrets and sensitive field values.
6. Define retention and access for operational data.
7. Build alerts on symptoms that require action, not raw noise.
8. Test telemetry during injected failures and retries.

## Decision points
Persist telemetry in Salesforce only when volume and retention fit platform economics; export to external observability systems for high-volume or cross-system analysis.

## Common failure patterns
Logging every record, sensitive payload capture, unstructured messages, no correlation, alerts without owners, and dependence on temporary trace flags.

## Verification
Trigger representative success/failure paths and prove operators can identify transaction, cause, affected entity, and recovery action.

## Expected output
An observability contract with structured signals, correlation, retention, alerts, and diagnostic evidence.

## Stop conditions
Escalate when telemetry requirements create unacceptable data exposure, storage cost, or platform event/log volume.