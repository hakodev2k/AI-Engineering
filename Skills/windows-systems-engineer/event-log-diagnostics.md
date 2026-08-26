# Event Log Diagnostics

## Purpose
Use Windows Event Logs as structured evidence for troubleshooting, auditing, and timeline reconstruction.

## When to use
Use for service failures, authentication incidents, crashes, policy issues, boot problems, scheduled-task failures, or incident reconstruction.

## Inputs
Symptom, affected systems, approximate time range, relevant identities/services, and known event sources or IDs.

## Preconditions
Preserve time-zone context and clock accuracy. Avoid clearing logs during active investigation.

## Context to inspect
System, Application, Security, Setup, and relevant Applications and Services channels; provider metadata; correlation/activity IDs; forwarded logs; retention settings; and adjacent telemetry.

## Core knowledge
An event ID is meaningful only with provider, version, fields, context, and sequence. Errors may be consequences rather than causes. Operational/debug channels can expose subsystem-specific detail. Security logs require careful privilege and privacy handling.

## Procedure
1. Define the failure interval precisely.
2. Identify the subsystem and likely providers/channels.
3. Filter by time, provider, event ID, level, identity, and correlation fields.
4. Build a sequence around the first meaningful deviation.
5. Compare with a healthy host or previous healthy interval.
6. Correlate with service, network, authentication, update, and application evidence.
7. Test the leading causal hypothesis.
8. Preserve key events or export logs when escalation is needed.
9. Fix the underlying issue and observe subsequent logs.

## Decision points
Increase logging temporarily when normal channels lack evidence, but account for volume and sensitive data. Prefer centralized event forwarding for fleet/security use cases.

## Common failure patterns
Searching only for red error icons, assuming the last event caused the failure, relying on event-ID web searches without provider context, clearing logs, and ignoring clock skew.

## Verification
Confirm the original failure no longer occurs, expected success events appear, correlated telemetry is healthy, and no new high-severity events are introduced.

## Expected output
A time-ordered evidence set supporting root cause, remediation, or escalation.

## Stop conditions
Stop when logs may be legal/security evidence requiring preservation controls, audit logs are inaccessible, or enabling verbose logging could expose secrets or destabilize the host.