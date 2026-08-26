# Secure Logging and Telemetry

## Purpose
Create diagnostically useful mobile telemetry without leaking credentials, personal data, cryptographic material, or sensitive business state.

## When to use
Use when adding logs, analytics, crash reporting, tracing, remote diagnostics, or incident instrumentation.

## Inputs
Data classification, observability requirements, SDK configuration, retention policy, incident needs.

## Preconditions
Define prohibited and permitted telemetry fields.

## Context to inspect
Application logs, OS logs, crash dumps, analytics events, breadcrumbs, network logging, debug builds, and vendor SDKs.

## Core knowledge
Logs often escape normal application boundaries and persist longer than expected. Treat telemetry as an external data sink and minimize at source.

## Procedure
1. Inventory telemetry producers and destinations.
2. Classify fields and remove secrets.
3. Redact or tokenize sensitive identifiers.
4. Separate debug diagnostics from production telemetry.
5. Prevent request/response body logging by default.
6. Define retention and access controls.
7. Validate crash reports and breadcrumbs.
8. Test error paths for accidental disclosure.

## Decision points
Log identifiers only when operational value exceeds privacy risk; prefer scoped pseudonymous correlation IDs. Enable verbose diagnostics temporarily and explicitly.

## Common failure patterns
Tokens in URLs, passwords in exceptions, full payload logging, production debug logs, unbounded retention, and third-party crash tools capturing sensitive screens/state.

## Verification
Trigger representative failures and inspect all telemetry destinations for prohibited data.

## Expected output
A telemetry schema and configuration that supports diagnosis while enforcing data-minimization rules.

## Stop conditions
Escalate when incident requirements demand collection of data prohibited by security/privacy policy.