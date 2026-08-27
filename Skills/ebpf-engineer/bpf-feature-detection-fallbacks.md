# BPF Feature Detection and Fallbacks

## Purpose
Make eBPF software adapt safely to heterogeneous kernels through capability detection and explicit degradation paths.

## When to use
Use when supporting multiple kernels, distributions, architectures, or restricted environments.

## Inputs
Feature dependencies, support policy, kernel targets, fallback implementations, required vs optional functionality.

## Context to inspect
Inspect program/map/helper/link/BTF requirements, kernel configs, vendor backports, privilege restrictions, and loader probes.

## Core knowledge
Kernel release strings are weak capability indicators. Runtime probes and attempted feature creation provide stronger evidence, but probes themselves need safe cleanup and clear semantics.

## Procedure
1. Enumerate each feature's concrete kernel dependencies.
2. Classify features as required, optional, or degradable.
3. Implement direct capability probes where feasible.
4. Cache probe results per host/kernel lifecycle appropriately.
5. Select fallback implementation only when semantics remain acceptable.
6. Expose disabled/degraded state to operators.
7. Test false-positive/false-negative probe scenarios.
8. Re-probe after relevant kernel/environment changes.
9. Keep version checks only for documented exceptional cases.

## Decision points
Fail startup for missing required safety/correctness features; degrade optional telemetry explicitly. Do not substitute a fallback with materially different security semantics without approval.

## Common failure patterns
Version-only branching, silent degradation, probes that leak resources, treating permission denial as feature absence, and fallback semantic drift.

## Verification
Test supported, unsupported, permission-denied, and vendor-backported environments; assert selected implementation and operator-visible state.

## Expected output
A deterministic capability matrix and safe fallback policy.

## Stop conditions
Stop when required semantics cannot be distinguished reliably from unsupported or unauthorized states.