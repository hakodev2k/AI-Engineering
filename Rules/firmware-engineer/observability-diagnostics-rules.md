# Observability and Diagnostics

## Purpose
Provide production evidence without destabilizing constrained systems.

## Scope
Logs, counters, traces, crash records, health status, and diagnostic commands.

## MUST
- Critical failures MUST produce bounded diagnostic evidence appropriate to available resources.
- Diagnostic output MUST identify firmware version/build and relevant reset/fault context.
- Logging overhead, storage, and bandwidth MUST be bounded.
- Sensitive data MUST be redacted or excluded.
- Production conclusions MUST use available device evidence rather than agent confidence.

## MUST NOT
- Logging MUST NOT materially violate real-time deadlines without explicit design approval.
- Diagnostic interfaces MUST NOT bypass authorization boundaries.

## SHOULD
- Counters SHOULD expose rare failure modes that cannot be reproduced easily.
- Crash evidence SHOULD survive reset when practical.

## Exceptions
Omitted telemetry requires a documented resource/security rationale.

## Verification
Trigger faults, inspect emitted evidence, measure logging overhead, test rollover, and scan output for secrets.