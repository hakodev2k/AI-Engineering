# Error Message and Diagnostics Design

## Purpose
Design actionable errors and diagnostics so developers can identify failure class, root cause, and safe next action without opening a support ticket.

## When to use
Use when introducing APIs, SDKs, CLI commands, model operations, authentication, deployment, or when support data shows repeated diagnostic ambiguity.

## Inputs
Error taxonomy, logs, traces, API responses, SDK exceptions, user reports, rate-limit behavior, authentication rules, and platform constraints.

## Context to inspect
Inspect real failures across client, network, gateway, model, tool, policy, quota, and downstream-service layers. Review what identifiers and metadata are currently exposed.

## Core knowledge
Useful errors separate symptom from cause and distinguish retryable, user-correctable, and operator-only failures. Diagnostics should correlate requests across layers while avoiding sensitive data leakage.

## Procedure
1. Inventory high-frequency and high-severity failure modes.
2. Define stable machine-readable error codes.
3. Map each code to category, retryability, likely cause, and remediation.
4. Include request or correlation identifiers where safe.
5. Preserve useful server metadata through SDK layers.
6. State invalid fields and constraints precisely.
7. Provide retry-after or quota information when applicable.
8. Add links to targeted troubleshooting only when they remain stable.
9. Ensure logs contain deeper operator context without exposing secrets to clients.
10. Test nested and partial failures such as streaming interruption or tool-call errors.
11. Validate messages with developers unfamiliar with the implementation.

## Decision points
Expose detail that enables correction but not internal secrets or exploitable architecture. Use structured fields for automation and human-readable messages for comprehension. Retry guidance must depend on error semantics, not generic status codes alone.

## Common failure patterns
Generic 'something went wrong', swallowing original errors, leaking tokens or prompts, inconsistent codes, advising retries for deterministic validation failures, and omitting correlation IDs.

## Verification
Inject representative failures, confirm client-visible messages and SDK exceptions, verify retry metadata, trace correlation end-to-end, and test that sensitive values are redacted.

## Expected output
A stable error taxonomy, message templates, remediation guidance, structured metadata, and tests.

## Stop conditions
Escalate when revealing diagnostic detail creates security risk, ownership of an error class is unclear, or remediation requires privileged production access.