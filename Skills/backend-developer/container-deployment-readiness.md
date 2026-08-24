# Container and Deployment Readiness

## Purpose
Prepare backend services for repeatable containerized deployment, safe startup/shutdown, health management, and horizontal scaling.

## When to use
Use before production deployment, containerization, orchestrator migration, or scaling changes.

## Inputs
Application runtime, build process, ports, dependencies, resource profile, orchestration environment, release strategy.

## Context to inspect
Container build, base image, process model, health endpoints, signals, filesystem assumptions, config/secrets, resource limits, and startup dependencies.

## Core knowledge
Immutable images, non-root execution, multi-stage builds, graceful termination, readiness/liveness semantics, statelessness, resource requests/limits, and supply-chain hygiene.

## Procedure
1. Produce a deterministic minimal runtime artifact.
2. Run as non-root with only required filesystem permissions.
3. Externalize config and secrets.
4. Implement meaningful readiness and liveness behavior.
5. Handle termination signals and drain in-flight work.
6. Remove local-state assumptions or make them explicit.
7. Set resource expectations from measurement.
8. Scan dependencies/images and pin controlled versions.
9. Test rolling replacement and restart behavior.

## Decision points
Keep state external for horizontally scaled services. Separate readiness from liveness so dependency degradation does not create restart storms.

## Common failure patterns
Running as root, mutable containers, liveness checks that call fragile dependencies, abrupt shutdown, huge images, floating tags, and writable local-state dependence.

## Verification
Run container security/build checks, health transitions, graceful termination, rolling deployment, restart, and multi-instance tests.

## Expected output
A deployable service artifact with documented runtime and health behavior.

## Stop conditions
Stop when deployment assumptions conflict with required persistence, privilege, or network policy and no approved design exists.