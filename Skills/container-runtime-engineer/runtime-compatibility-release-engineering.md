# Runtime Compatibility and Release Engineering

## Purpose
Ship container-runtime changes safely across kernel, architecture, OCI, distribution, and orchestrator compatibility boundaries.

## When to use
Use for releases, dependency upgrades, kernel support changes, deprecations, or rollout planning.

## Inputs
Supported platform matrix, changelog, conformance results, dependency graph, security advisories, rollout telemetry, rollback mechanism.

## Context to inspect
Inspect OCI spec versions, kernel feature detection, libc/runtime dependencies, architecture-specific code, orchestrator integrations, packaging, and upgrade/downgrade state compatibility.

## Core knowledge
Kernel APIs evolve unevenly across distributions. Feature detection is often safer than version checks. Runtime upgrades can affect persistent state and running containers, so compatibility spans both API and on-host state.

## Procedure
1. Define supported platforms and compatibility guarantees.
2. Classify changes as internal, additive, behavioral, or breaking.
3. Run conformance and platform matrix tests.
4. Test upgrade with running containers and persisted state.
5. Test rollback/downgrade where supported.
6. Validate architecture-specific behavior.
7. Review security and dependency changes.
8. Stage rollout to representative hosts.
9. Monitor lifecycle errors, latency, leaks, and crash rate.
10. Expand only after acceptance criteria pass.
11. Publish precise migration/deprecation notes.

## Decision points
Prefer runtime feature probing over kernel-version assumptions. Use staged rollout for any change touching process creation, mounts, cgroups, security, or state formats.

## Common failure patterns
Happy-path-only upgrades, irreversible state migrations, hidden distro assumptions, architecture gaps, dependency bumps without behavior review, and rollback not tested.

## Verification
Release evidence includes conformance, matrix, upgrade/rollback, soak, and staged-production telemetry.

## Expected output
A releasable runtime version with documented compatibility and rollback.

## Stop conditions
Stop release for unexplained conformance regressions, irreversible migration without approval, or missing rollback for high-risk changes.