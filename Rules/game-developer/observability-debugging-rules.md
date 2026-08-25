# Observability and Debugging Rules

## Purpose
Make complex gameplay failures reproducible and diagnosable without relying on developer intuition.

## Scope
Logs, metrics, traces, crash data, replay state, debug overlays, and investigation workflows.

## MUST
- Production-critical failures MUST preserve contextual evidence such as build, platform, scene/session state, and relevant identifiers without exposing sensitive data.
- Root-cause conclusions MUST be supported by reproducible behavior or operational evidence.
- Debug instrumentation MUST have bounded runtime cost in release configurations.
- Crash and hang reports MUST identify the exact build and symbols needed for diagnosis.

## MUST NOT
- MUST NOT silently swallow unexpected exceptions or failed critical state transitions.
- MUST NOT leave privileged debug commands exposed in production without authorization controls.

## SHOULD
- Complex systems SHOULD expose targeted visualization of state, ownership, and transitions.

## Exceptions
Privacy-sensitive telemetry may be reduced when diagnostics are replaced by safer equivalent evidence.

## Verification
Reproduce known faults, inspect crash artifacts, validate symbolication, measure instrumentation overhead, and review telemetry redaction.