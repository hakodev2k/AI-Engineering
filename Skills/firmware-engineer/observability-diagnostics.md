# Firmware Observability and Diagnostics

## Purpose
Make constrained devices diagnosable through intentional logs, counters, traces and fault records.

## When to use
Use for production support, intermittent failures, performance work or telemetry design.

## Inputs
Failure modes, available transports, storage/RAM budget, privacy requirements and support workflow.

## Context to inspect
Logging APIs, crash records, counters, timestamps, build identity and telemetry upload paths.

## Core knowledge
Observability must be bounded and useful under failure. Stable event identifiers and build/version context often matter more than verbose text.

## Procedure
1. Identify questions support must answer.
2. Define high-value events and metrics.
3. Include timestamps and build identity.
4. Bound memory, storage and bandwidth.
5. Preserve critical fault context across reset where justified.
6. Avoid secrets and unnecessary sensitive data.
7. Provide extraction/decoding workflow.
8. Validate diagnostics during representative failures.

## Decision points
Prefer structured compact events for production; richer debug logs may be enabled selectively when resource budgets allow.

## Common failure patterns
Log flooding, blocking logging, missing timestamps, unstable formats, no build identity and diagnostics that disappear on reset.

## Verification
Trigger known faults and confirm evidence is sufficient to distinguish causes without destabilizing the device.

## Expected output
A bounded diagnostic contract and usable support workflow.

## Stop conditions
Escalate when telemetry collection conflicts with privacy, security or regulatory requirements.