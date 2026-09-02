# Privacy and Sensitive Data Rules

## Purpose
Prevent distributed tracing from becoming an uncontrolled store of secrets, personal data, or regulated information.

## Scope
Applies to span attributes, events, baggage, exception data, resource metadata, and collector processing.

## MUST
- Trace data MUST be classified against applicable privacy and data-handling requirements before collection.
- Instrumentation MUST minimize sensitive fields and apply approved redaction, hashing, tokenization, or omission where required.
- Exception capture MUST be reviewed for payload, query, header, and stack-frame leakage.
- Access to trace data containing sensitive operational context MUST follow least privilege.

## MUST NOT
- MUST NOT record passwords, API keys, session tokens, authorization headers, private keys, or raw credentials.
- MUST NOT copy request or message bodies wholesale into tracing by default.
- MUST NOT rely on retention expiry as the primary protection for prohibited data.

## SHOULD
- Redaction SHOULD occur as close to the instrumentation source as practical.
- Sensitive-data scans SHOULD be part of telemetry validation.

## Exceptions
Exceptions require documented legal or operational justification, data classification, retention, access controls, risk acceptance, and explicit human approval.

## Verification
Inspect emitted traces, run secret/PII detection where available, review collector processors, access policies, retention settings, and representative exception telemetry.
