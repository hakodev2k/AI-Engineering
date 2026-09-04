# Privacy-Safe Logging and Observability

## Purpose
Provide enough telemetry to operate and debug AI systems without turning logs, traces, prompt histories, and metrics into uncontrolled stores of personal or sensitive data.

## When to use
Use when designing observability, enabling prompt tracing, debugging production incidents, adopting an APM/LLM observability platform, or expanding telemetry fields.

## Inputs
- Logging and tracing architecture
- Data classifications
- Debugging and SRE requirements
- Retention policies
- Vendor telemetry behavior

## Context to inspect
Inspect application logs, distributed traces, prompt/response traces, exception payloads, metrics labels, request dumps, replay systems, dashboards, exports, and support tooling.

## Core knowledge
Observability data often bypasses primary application privacy controls and is broadly accessible. High-cardinality labels, stack traces, payload capture, prompts, and generated outputs can expose identifiers or sensitive content. Good design preserves diagnostic value through structured metadata, redaction, sampling, correlation IDs, and short retention.

## Procedure
1. Define the minimum telemetry needed for reliability and debugging.
2. Classify every logged or traced field.
3. Remove raw payload capture by default.
4. Redact or tokenize identifiers before emission.
5. Replace content with safe derived metrics where possible.
6. Prevent secrets and sensitive fields from becoming metric labels.
7. Scope prompt/response tracing to approved environments and use cases.
8. Apply least-privilege access and short retention to sensitive telemetry.
9. Configure vendor-side retention and training-use settings.
10. Add automated tests or scanners for prohibited fields.
11. Define break-glass debugging paths with approval and audit.
12. Review telemetry after major feature changes.

## Decision points
Prefer metadata such as model name, latency, token counts, error class, and correlation ID over raw content. Use temporary targeted capture for hard incidents rather than permanent broad payload logging.

## Common failure patterns
- Logging full prompts and documents
- Putting user IDs or email addresses in metric labels
- Assuming internal telemetry is low risk
- Forgetting vendor retention defaults
- Keeping debug payloads indefinitely
- Giving support teams broad access to production traces

## Verification
Generate representative sensitive requests and inspect all logs, traces, metrics, dashboards, and exports. Run scanners for prohibited patterns and verify retention expiry and access controls.

## Expected output
An observability design that preserves operational diagnostics while minimizing personal data, with redaction rules, approved fields, retention, access controls, and verification tests.

## Stop conditions
Escalate when operational requirements demand persistent raw sensitive payloads, vendor telemetry controls are insufficient, or required redaction cannot be performed before data leaves the trust boundary.