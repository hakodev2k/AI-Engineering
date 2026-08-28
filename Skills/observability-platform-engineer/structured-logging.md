# Structured Logging

## Purpose
Create consistent, queryable logs that support debugging, incident response, audit needs, and correlation without leaking sensitive data.

## When to use
Use when standardizing application logs, reviewing logging quality, or reducing noisy or expensive logging.

## Inputs
Application code, log samples, incident needs, data classification rules, backend constraints.

## Context to inspect
Inspect log levels, field names, timestamps, correlation IDs, exception handling, redaction, sampling, and ingestion costs.

## Core knowledge
Understand structured events, severity semantics, event identity, trace correlation, redaction, sampling, schema evolution, and retention.

## Procedure
1. Identify diagnostic and audit use cases.
2. Define a stable event schema and required context fields.
3. Use structured fields instead of parsing free-form messages.
4. Normalize severity and timestamp handling.
5. Add trace/span/request correlation where available.
6. Redact secrets and sensitive attributes before export.
7. Reduce duplicate and high-frequency low-value events.
8. Establish sampling only where loss is acceptable.
9. Validate exception and failure logging.
10. Document ownership and retention expectations.

## Decision points
Use logs for discrete contextual events; use metrics for aggregate trends and traces for causal request paths. Sample verbose logs before critical security or error events.

## Common failure patterns
Logging secrets, string-only events, inconsistent levels, duplicate stack traces, missing correlation, excessive debug logs in production.

## Verification
Exercise success and failure paths, query by key fields, confirm trace correlation, test redaction, and compare ingestion volume before and after changes.

## Expected output
A structured logging contract with verified examples, redaction rules, and operationally useful queries.

## Stop conditions
Stop if legal retention or sensitive-data requirements are unclear.