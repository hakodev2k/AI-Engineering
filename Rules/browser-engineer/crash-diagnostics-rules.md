# Crash Diagnostics Rules
## Purpose
Make browser failures diagnosable without exposing sensitive user data.
## Scope
Crash reporting, assertions, minidumps, breadcrumbs, logs, and diagnostic metadata.
## MUST
- Crash diagnostics MUST preserve enough state to identify failing subsystem and invariant where feasible.
- Diagnostic collection MUST follow privacy and data-minimization requirements.
- Repeated crashes MUST be grouped using stable technical evidence rather than superficial symptoms.
## MUST NOT
- MUST NOT log page secrets, credentials, tokens, or unnecessary content into diagnostics.
- MUST NOT remove assertions merely to reduce crash volume without resolving the violated invariant.
## SHOULD
- SHOULD use structured, versioned diagnostic fields for high-value failure modes.
## Exceptions
Additional sensitive diagnostics require explicit privacy/security approval and bounded collection.
## Verification
Inspect crash payload schemas, privacy tests, synthetic crashes, symbolization, grouping quality, and redaction tests.