# Structured Logging

## Purpose
Create machine-queryable logs that preserve enough context for reliable production investigation without leaking sensitive data or generating uncontrolled cost.

## When to use
Use when instrumenting services, standardizing logs, or fixing investigations that depend on free-text search.

## Inputs
Codebase, logging framework, telemetry backend, data-classification rules, incident examples, and service metadata.

## Context to inspect
Inspect existing event schemas, log levels, correlation fields, exception handling, request context, PII exposure, ingestion limits, and retention.

## Core knowledge
Logs are events with stable semantic fields. Message text is for humans; structured properties are for filtering and aggregation. Severity must describe operational significance rather than developer preference.

## Procedure
1. Identify diagnostic events and questions.
2. Define stable event names and fields.
3. Add service, environment, version, operation, and correlation context.
4. Record relevant outcomes and durations.
5. Capture exceptions without duplicate logging.
6. Redact or exclude secrets and sensitive data.
7. Assign consistent severity levels.
8. Test queries against realistic incidents.
9. Review volume and cost.

## Decision points
Log state transitions and meaningful outcomes rather than every code path. Prefer identifiers over full payloads unless payload capture is explicitly safe and necessary.

## Common failure patterns
String-only logs, secret leakage, duplicate exception logs, inconsistent field names, logging huge payloads, INFO-level noise, and missing request correlation.

## Verification
Confirm representative events can be queried by service, operation, correlation, outcome, and error; verify sensitive fields are absent and volume is acceptable.

## Expected output
Consistent structured logging with documented schemas and useful investigation queries.

## Stop conditions
Stop when data-classification rules are unclear or proposed logging could expose regulated or secret information.