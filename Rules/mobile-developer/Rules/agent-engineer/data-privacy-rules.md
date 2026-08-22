# Data Privacy Rules
## Purpose
Limit collection, exposure, and retention of personal or confidential data.
## Scope
Prompts, memory, retrieval, tool payloads, telemetry, and provider calls.
## MUST
- Minimize sensitive data sent to models and tools to what the task requires.
- Enforce retention, access, deletion, and tenant-isolation requirements.
- Review provider data handling before transmitting protected information.
## MUST NOT
- Reuse private data for unrelated tasks without authorization.
- Expose one user's context to another user or tenant.
## SHOULD
- Redact, tokenize, or pseudonymize sensitive fields where utility is preserved.
## Exceptions
Additional processing requires documented purpose, lawful/approved basis, controls, and retention.
## Verification
Use data-flow review, access tests, retention checks, provider configuration inspection, and leakage tests.