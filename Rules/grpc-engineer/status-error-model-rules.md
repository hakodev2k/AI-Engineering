# Status and Error Model Rules

## Purpose
Make failures machine-actionable, diagnosable, and consistent across gRPC services.

## Scope
Status codes, error details, retries, client-visible messages, and exception translation.

## MUST
- Failures MUST map to the most specific stable gRPC status code justified by semantics.
- Internal exceptions MUST be translated at the service boundary.
- Retryability MUST be determined by semantics, not convenience.
- Structured error details MUST be used when clients need machine-readable remediation data.
- Diagnostic context MUST remain available in server telemetry.

## MUST NOT
- MUST NOT return `UNKNOWN` or `INTERNAL` for expected domain failures.
- MUST NOT expose stack traces, secrets, internal topology, or sensitive data to clients.
- MUST NOT swallow unexpected exceptions or report success after partial failure.

## SHOULD
- Error messages SHOULD be stable enough for humans but clients SHOULD branch on codes/details, not text.

## Exceptions
Information disclosure beyond normal error contracts requires a controlled diagnostic context and explicit authorization.

## Verification
Test representative failure paths, inspect status/detail payloads, validate retry classification, and review logs/traces for preserved diagnostics without sensitive leakage.