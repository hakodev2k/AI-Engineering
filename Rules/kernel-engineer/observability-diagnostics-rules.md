# Observability and Diagnostics Rules

## Purpose
Make kernel behavior diagnosable without destabilizing the system or exposing sensitive data.

## Scope
Logs, counters, traces, debug interfaces, crash information, and production diagnostics.

## MUST
- Diagnostics MUST preserve enough context to distinguish subsystem, operation, and failure class.
- High-frequency instrumentation MUST have bounded overhead and rate behavior.
- Sensitive values, credentials, private memory contents, and unnecessary addresses MUST NOT be emitted.
- New critical failure modes MUST have an observable signal suitable for investigation.
- Debug interfaces that alter state MUST have explicit privilege and lifecycle controls.

## MUST NOT
- MUST NOT flood logs from externally triggerable or tight-loop paths.
- MUST NOT rely solely on debug-only instrumentation for production-critical diagnosis.
- MUST NOT change timing-sensitive behavior substantially just by enabling routine observability.
- MUST NOT expose mutable debug controls to unauthorized users.

## SHOULD
- Prefer structured counters and tracepoints for repeated analysis over ad hoc logging.
- Diagnostics SHOULD support correlation across related operations.
- Instrumentation SHOULD be removable or dynamically controllable when overhead is material.

## Exceptions
Exceptions require diagnostic need, exposure/overhead analysis, and maintainer approval.

## Verification
Measure instrumentation overhead, trigger failure paths, inspect privilege boundaries, test rate limiting, and review emitted data for sensitive information.