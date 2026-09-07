# Ingest Rules

## Purpose
Ensure media enters the platform with validated identity, timing, format, and recoverable failure behavior.

## Scope
Push/pull ingest, contribution feeds, upload ingest, gateways, and protocol adapters.

## MUST
- Ingest endpoints MUST authenticate and authorize publishers where trust boundaries require it.
- Stream identifiers, codecs, container metadata, timestamps, and declared parameters MUST be validated before downstream use.
- Connection loss, duplicate sessions, reconnects, and malformed input MUST have defined handling.
- Ingest health MUST expose enough evidence to distinguish source failure from platform failure.

## MUST NOT
- MUST NOT trust client-declared dimensions, durations, bitrates, timestamps, or lengths without bounds checking.
- MUST NOT silently accept competing publishers when ownership is ambiguous.
- MUST NOT retry indefinitely without backoff and a termination policy.

## SHOULD
- Ingest SHOULD preserve useful source diagnostics without exposing credentials or tokens.
- Regional ingest SHOULD minimize avoidable first-mile latency and failure concentration.

## Exceptions
Protocol limitations require documented compensating controls, risk, and verification.

## Verification
Use malformed-input tests, reconnect tests, authorization tests, packet captures, ingest metrics, logs, and regional failure exercises.