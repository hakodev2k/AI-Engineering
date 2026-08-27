# Production Firmware Debugging

## Purpose
Investigate difficult firmware failures using evidence while minimizing disturbance to timing-sensitive behavior.

## When to use
Use for crashes, hangs, corrupt state, intermittent resets or device-only failures.

## Inputs
Symptom, build artifact, symbols, logs, fault record, reproduction conditions and hardware revision.

## Context to inspect
Recent changes, reset cause, exception context, stack, task state, memory map and environmental triggers.

## Core knowledge
Embedded failures are often timing- or state-dependent. Debug instrumentation can alter the failure, so preserve evidence before changing behavior.

## Procedure
1. Establish exact build and hardware identity.
2. Preserve original evidence.
3. Classify crash, hang, reset or corruption.
4. Reconstruct execution context from symbols and fault data.
5. Form competing hypotheses.
6. Design minimally invasive discriminating tests.
7. Reproduce when possible.
8. Fix root cause, not symptom.
9. Add regression coverage and diagnostics.

## Decision points
Use live debugging for reproducible lab failures; prefer postmortem records and traces for timing-sensitive or field-only faults.

## Common failure patterns
Changing optimization before collecting evidence, trusting stale symbols, guessing from last log line, masking races and failing to test the fix under original conditions.

## Verification
Reproduce before fix when possible, demonstrate absence after fix, run stress/regression tests and verify diagnostic attribution.

## Expected output
Evidence-backed root cause, corrective change and regression protection.

## Stop conditions
Escalate when required production evidence or exact artifacts are unavailable and further changes would be speculative.