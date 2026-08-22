# Privacy-Safe Logging and Telemetry

## Purpose
Preserve operational observability without turning logs, traces, analytics, and crash reports into uncontrolled personal-data stores.

## When to use
Use when designing logging standards, instrumenting services, investigating incidents, or integrating observability vendors.

## Inputs
Telemetry schema, debugging needs, data classifications, retention, access model, sampling, and vendor configuration.

## Context to inspect
Inspect request/response logging, headers, query strings, exception payloads, identifiers, free text, traces, dashboards, and exports.

## Core knowledge
Telemetry often has broad access and replication. Prefer event metadata and opaque correlation identifiers over payload capture. Redaction must happen before data leaves the process when possible.

## Procedure
1. Define diagnostic questions telemetry must answer.
2. Classify proposed fields.
3. Exclude secrets and unnecessary personal content.
4. Tokenize or coarsen identifiers where useful.
5. Apply structured allowlists rather than blacklist-only redaction.
6. Set short, justified retention.
7. Restrict access and exports.
8. Test exception and edge paths for leakage.
9. Monitor schema drift.

## Decision points
Enable temporary elevated diagnostics only with bounded scope, duration, approval, and cleanup.

## Common failure patterns
Logging bodies by default, secrets in URLs, stack traces containing payloads, unrestricted dashboards, and permanent debug logging.

## Verification
Run synthetic sensitive values through representative paths and confirm they do not appear in telemetry stores.

## Expected output
Useful observability with minimized privacy exposure.

## Stop conditions
Stop rollout when essential debugging depends on uncontrolled sensitive payload capture.