# Runtime Testing and Conformance

## Purpose
Build a layered test strategy that proves container-runtime correctness, OCI compatibility, host cleanup, security boundaries, and regression resistance.

## When to use
Use for new runtime features, releases, refactors, kernel support changes, or compatibility validation.

## Inputs
Specifications, supported kernels/architectures, runtime features, known incidents, CI infrastructure, reference workloads.

## Context to inspect
Inspect unit/integration/e2e coverage, conformance suites, privileged test requirements, flaky tests, host isolation, and cleanup guarantees.

## Core knowledge
Runtime tests must observe kernel-level outcomes, not only API responses. Conformance is necessary but insufficient for implementation-specific recovery, security, and performance guarantees.

## Procedure
1. Map requirements and lifecycle invariants to tests.
2. Keep pure parsing/state logic in fast unit tests.
3. Test namespace/cgroup/mount/process behavior on real kernels.
4. Run OCI conformance where applicable.
5. Add negative security tests.
6. Add crash/fault injection at lifecycle boundaries.
7. Test concurrent operations and rapid exit.
8. Verify host resources before/after each suite.
9. Cover supported kernel/runtime combinations.
10. Quarantine flaky tests only with an owner and root-cause plan.
11. Gate releases on critical compatibility/security suites.

## Decision points
Use mocks only for external failure shaping; use real kernel primitives for behavioral verification. Prefer hermetic disposable hosts/VMs for destructive runtime tests.

## Common failure patterns
API-only assertions, tests requiring hidden host state, leaked mounts/cgroups, skipped failure paths, timing sleeps, and conformance treated as full correctness.

## Verification
CI must demonstrate deterministic pass rates, cleanup checks, conformance status, and regression tests tied to past incidents.

## Expected output
A maintainable test matrix and evidence for release confidence.

## Stop conditions
Stop if tests can alter shared production hosts or privileged CI isolation is insufficient.