# Security Logging and Forensics

## Purpose
Design constrained-device security telemetry and forensic evidence that supports incident detection and diagnosis without leaking secrets, exhausting flash, or enabling attacker-controlled log abuse.

## When to use
Use when adding security events, designing fleet telemetry, investigating incidents, or defining crash/audit retention.

## Inputs
Threat model, available storage/bandwidth, logging framework, device identity, clock quality, backend telemetry, privacy requirements, crash dumps, and incident needs.

## Preconditions
Classify data that must never be logged: private keys, credentials, sensitive payloads, and unnecessary personal data.

## Context to inspect
Boot/update failures, authentication events, lifecycle/debug transitions, security faults, watchdog/reset reasons, parser rejection counters, crash records, time sources, log transport, retention, and backend correlation.

## Core knowledge
Embedded logs are scarce and attacker-influenced. Prefer compact structured events, bounded counters, stable event IDs, reset-cause evidence, and integrity/freshness where audit value requires it. Logs are evidence, not enforcement.

## Procedure
1. Define incident questions telemetry must answer.
2. Select high-value events and avoid verbose payload capture.
3. Assign stable event IDs, severity, component, and bounded fields.
4. Redact secrets and minimize identifiers.
5. Record boot/reset reason, firmware version, security lifecycle, and update state needed for correlation.
6. Protect local audit records from trivial modification/rollback when required.
7. Bound rate, storage, and network use; aggregate repeated attacker-triggered events.
8. Handle unreliable clocks using monotonic counters/boot IDs plus server timestamps.
9. Secure telemetry transport and backend authorization.
10. Define crash dump access and sanitization.
11. Test log flooding, malformed fields, storage-full behavior, reset persistence, and offline upload.

## Decision points
Persist only events needed across reset; stream lower-value telemetry when connectivity exists. Full crash dumps aid diagnosis but may contain secrets, so use scoped collection and access controls or sanitized minidumps.

## Common failure patterns
Logging keys/tokens; attacker-controlled strings causing format issues; flash wear from repeated failures; timestamps trusted despite unset clocks; unauthenticated telemetry accepted as evidence; logs consuming memory needed by critical tasks.

## Verification
Trigger representative security events and incidents, inspect device and backend records, confirm secret redaction, rate/storage bounds, reset correlation, transport protection, and useful reconstruction of event sequence.

## Expected output
Security event schema, implementation, retention/rate policy, forensic runbook, and validation evidence.

## Stop conditions
Escalate when required evidence conflicts with privacy/legal policy, storage endurance cannot support retention, or forensic access would expose protected secrets without an approved process.