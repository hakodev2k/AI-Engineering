# Container Platform Engineering

## Purpose
Operate containerized workloads safely from image build through runtime.

## When to use
Use for Docker image design, registry usage, runtime configuration, orchestration, or container incidents.

## Inputs
Application runtime, Dockerfile, image registry, deployment manifests, resource needs, security constraints.

## Context to inspect
Base images, layers, image size, users, capabilities, health checks, resource limits, mounted secrets, runtime logs.

## Core knowledge
Images should be minimal, immutable, non-root where possible, pinned, scanned, and reproducible. Runtime behavior depends on PID 1 handling, signals, filesystem, resource limits, probes, and network policy.

## Procedure
1. Inspect image provenance and base version.
2. Use multi-stage builds where useful.
3. Remove build tools/secrets from runtime layers.
4. Run as non-root unless justified.
5. Define health/readiness behavior.
6. Set requests/limits from observed usage.
7. Handle SIGTERM and graceful shutdown.
8. Scan image and dependencies.
9. Verify registry retention and immutability.
10. Test restart and resource-pressure behavior.

## Decision points
Use distroless/minimal images when debugging trade-offs are acceptable; mount config/secrets at runtime instead of baking them in.

## Common failure patterns
Latest tags, root containers, no health checks, oversized images, hidden credentials in layers, no resource limits.

## Verification
Rebuild produces expected digest, security scan passes policy, runtime starts healthy, shutdown and restart are clean.

## Expected output
Hardened image and runtime contract with measurable resource and lifecycle behavior.

## Stop conditions
Stop for untrusted base images, leaked secrets, or workloads requiring privileged access without approval.