# Attach Point Selection

## Purpose
Choose hooks that provide required semantics with minimum fragility and overhead.

## Scope
Tracepoints, kprobes/kretprobes, fentry/fexit, uprobes, XDP, TC, cgroup, LSM, socket, perf-event, and related hooks.

## MUST
- Attach-point choice MUST be justified by semantic stability, kernel support, overhead, and required context.
- Hook assumptions MUST be documented and tested against supported targets.
- Attach failures MUST be observable and MUST NOT leave the system falsely reporting coverage.
- Multiple attachments MUST have deterministic lifecycle ownership.

## MUST NOT
- MUST NOT prefer fragile probes when a stable interface satisfies the requirement.
- MUST NOT assume a symbol exists across kernels or builds without detection.
- MUST NOT attach enforcement logic to a hook whose ordering or semantics cannot satisfy the policy.

## SHOULD
- Prefer stable tracepoints for observability when sufficient.
- Prefer fentry/fexit over kprobes where supported and semantically appropriate.

## Exceptions
A fragile hook requires documented necessity, compatibility tests, fallback, monitoring, and owner.

## Verification
Inspect attach metadata, test supported kernels, induce missing-hook conditions, and validate that coverage telemetry matches actual attachments.