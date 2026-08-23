# Observability and Diagnostics Rules

## Purpose
Provide production-useful evidence without destabilizing constrained firmware.

## Scope
Logs, counters, traces, crash data, reset reasons, health telemetry, and diagnostic interfaces.

## MUST
- Capture bounded diagnostic evidence for critical faults and resets.
- Protect secrets and sensitive data in diagnostic output.
- Ensure instrumentation overhead is compatible with timing, memory, power, and bandwidth budgets.

## MUST NOT
- Depend on verbose logging as the only way to diagnose timing-sensitive failures.
- Allow diagnostics to block critical execution indefinitely.

## SHOULD
- Use structured fault codes and monotonic counters that survive constrained environments.

## Exceptions
Diagnostics may be reduced for security or resource reasons when alternate evidence is defined.

## Verification
Measure instrumentation overhead and validate fault records, crash/reset evidence, redaction, and field-diagnostic workflows.