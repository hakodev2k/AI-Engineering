# Skill: Error Channel Threat Analysis

## Purpose
Assess and harden MCP failure paths so raw diagnostics do not cross from trusted operator systems into model-visible context.

## Trigger
New MCP tool integration, change in downstream exception handling, incident involving leaked diagnostics, or pre-release security review.

## Inputs
Tool definitions, exception types, downstream APIs, host forwarding behavior, logging configuration, sensitivity policy.

## Preconditions
The reviewer can reproduce representative tool failures without using production secrets.

## Required context
Trust boundaries: tool runtime, downstream service, MCP server, host/client, model context, logs/telemetry.

## Allowed tools
Source inspection, synthetic failure injection, deterministic sanitizer, test harness, read-only protocol docs.

## Constraints
Never put real credentials or regulated personal data into fixtures. Never solve leakage by disabling required authentication/authorization or by suppressing all operational diagnostics.

## Procedure
1. Enumerate every path producing `isError=true` or equivalent tool failure.
2. Capture raw failure shape using synthetic sensitive markers.
3. Identify which fields reach model context, logs, traces, and user UI.
4. Classify fields as model-safe or operator-only.
5. Define stable public error codes and bounded retry hints.
6. Apply `scripts/sanitize_mcp_error.py` before model forwarding.
7. Store protected diagnostic detail separately under correlation ID.
8. Test stack trace, path, SQL, email, token, URI-credential, and downstream-body fixtures.
9. Verify host logs do not accidentally re-inject protected detail into model context.

## Decision points
If the model requires a detail that is sensitive, replace it with a non-sensitive categorical code or require human/operator inspection. If safe retry cannot be determined, return non-retryable/unknown rather than raw exception detail.

## Expected output
Threat-boundary map, model-safe error contract, protected-diagnostic contract, test evidence, PASS/BLOCK decision.

## Metrics
Leakage cases, sanitizer coverage, error size, retry accuracy, false-redaction count.

## Verification
Independent security verifier executes failure corpus and confirms no forbidden marker appears in model-facing content.

## Failure handling
One sanitizer/configuration correction per detected root cause, maximum two cycles before escalation.

## Stop conditions
Stop if a raw secret/PII marker reaches model-visible output, diagnostics cannot be separated safely, or policy ownership is unclear.