# eBPF Production Debugging

## Purpose
Investigate production failures involving load, attach, missing events, incorrect attribution, excessive overhead, or stale BPF state.

## When to use
Use during incidents or hard-to-reproduce field failures.

## Inputs
Incident timeline, kernel metadata, loader logs, verifier logs, bpftool state, metrics, program/map/link inventory, workload identity.

## Context to inspect
Inspect what changed, actual loaded programs, attachment targets, map occupancy, buffer drops, privileges, BTF, kernel config, and consumer health.

## Core knowledge
Separate control-plane failures (load/attach/config) from dataplane failures (program semantics/state) and telemetry-pipeline failures (transfer/consumer). Avoid destructive inspection during incidents.

## Procedure
1. Preserve timeline and current BPF state.
2. Confirm expected programs and links are actually loaded/attached.
3. Compare object/build identity with deployment intent.
4. Check loader/verifier errors and capability changes.
5. Inspect map pressure, update failures, and event drops.
6. Validate hook execution with safe counters.
7. Check user-space consumer lag and decoding.
8. Reproduce on matching kernel when possible.
9. Mitigate by disabling the narrowest failing feature.
10. Document root cause and regression evidence.

## Decision points
Prefer read-only inspection first. Detach only when evidence shows instrumentation is causing impact or policy requires immediate rollback.

## Common failure patterns
Restarting before preserving evidence, assuming loaded means attached, clearing maps prematurely, ignoring kernel updates, and blaming verifier for consumer failures.

## Verification
After mitigation/fix, expected events/actions return, overhead normalizes, stale resources are absent, and regression scenario passes.

## Expected output
Evidence-backed root cause, safe mitigation, and prevention action.

## Stop conditions
Escalate before destructive actions, production kernel changes, or security-policy bypasses requiring approval.