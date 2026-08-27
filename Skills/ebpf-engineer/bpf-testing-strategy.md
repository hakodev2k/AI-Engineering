# BPF Testing Strategy

## Purpose
Create layered tests that prove eBPF program semantics, verifier acceptance, integration behavior, compatibility, and performance.

## When to use
Use for new programs, refactors, kernel-support changes, and regression prevention.

## Inputs
Programs, maps, hooks, user-space loader, support matrix, acceptance criteria, performance budgets.

## Context to inspect
Inspect available BPF test-run facilities, kernel lab/VMs, fixtures, packet/event generators, loader tests, and CI privileges.

## Core knowledge
Pure source-level tests cannot replace verifier and kernel execution. A mature suite separates deterministic program logic, attachment integration, compatibility, and load/performance tests.

## Procedure
1. Translate requirements into observable kernel/user-space outcomes.
2. Unit-test pure user-space parsing and policy logic.
3. Use program test-run facilities where supported for deterministic BPF inputs.
4. Test map state transitions and boundary values.
5. Run real attachment integration tests.
6. Cover negative/verifier-sensitive cases.
7. Execute compatibility matrix tests.
8. Add sustained load and overhead regressions for hot paths.
9. Test restart, cleanup, and partial failures.
10. Make failures capture kernel/verifier metadata.

## Decision points
Mock only boundaries that cannot be exercised cheaply; keep a real-kernel layer for semantics. Prioritize boundary kernels over exhaustive duplicate environments.

## Common failure patterns
Only testing loader success, no negative cases, CI on one kernel, mocks hiding attach failures, and flaky timing-dependent assertions.

## Verification
Tests must fail when known semantic, compatibility, lifecycle, or performance regressions are injected.

## Expected output
A layered, reproducible test strategy with explicit evidence for release readiness.

## Stop conditions
Stop release when required kernel integration or compatibility evidence is unavailable.