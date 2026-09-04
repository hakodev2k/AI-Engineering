# Structured Logging Rules

## Purpose
Ensure logs provide reliable diagnostic evidence without becoming a security, privacy, or cost liability.

## Scope
Applies to application, model gateway, retrieval, tool, background-processing, and observability-pipeline logs.

## MUST
- Production logs MUST be structured for fields used in filtering, correlation, alerting, or incident analysis.
- Error logs MUST preserve the failing operation, correlation identifier, outcome, and actionable diagnostic context.
- Log severity semantics MUST be documented and used consistently.
- Sensitive fields MUST be classified before they are logged, and approved redaction or omission MUST occur before export.
- Logging failures MUST degrade safely and MUST NOT cause request amplification loops.

## MUST NOT
- Logs MUST NOT contain secrets, credentials, raw access tokens, private keys, or unrestricted sensitive prompts or responses.
- Expected control-flow conditions MUST NOT be logged as high-severity incidents.
- Exceptions MUST NOT be swallowed after emitting a log unless the caller has an explicit recovery contract.
- Duplicate logging across layers MUST NOT create misleading incident volume.

## SHOULD
- Log stable event names and machine-readable error categories.
- Include deployment, model, prompt-template, and feature-version identifiers where safe and useful.

## Exceptions
Any sensitive-content logging exception requires explicit security/privacy approval, minimization, retention limits, and evidence that less invasive telemetry is insufficient.

## Verification
Review logging schemas, redaction tests, representative production entries, severity usage, retention settings, and failure-path tests.