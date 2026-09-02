# Real-Time Observability Rules

## Purpose
Provide evidence about timing and failure behavior without materially violating timing guarantees.

## Scope
Logs, metrics, traces, deadline counters, scheduler telemetry, and diagnostic instrumentation.

## MUST
- Critical timing paths MUST expose deadline misses, queue depth, execution time, and resource saturation where measurable.
- Instrumentation overhead MUST be bounded or characterized for deadline-sensitive paths.
- Diagnostic data MUST preserve enough context to correlate timing failures with workload and system state.
- Sensitive data and secrets MUST NOT be emitted through diagnostics.

## MUST NOT
- MUST NOT add synchronous logging or tracing that can introduce unbounded blocking into hard real-time paths.
- MUST NOT claim root cause solely from incomplete telemetry when competing hypotheses remain plausible.

## SHOULD
- Prefer low-overhead counters, ring buffers, and sampling strategies appropriate to the platform.

## Exceptions
Reduced observability requires documented timing or storage rationale and an alternative evidence mechanism.

## Verification
Inspect instrumentation paths, measure overhead, trigger deadline failures, review telemetry completeness, and run privacy/security checks.