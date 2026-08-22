# Docker and Deployment

## Purpose
Package and deploy .NET backend services as small, secure, reproducible containers with correct runtime and shutdown behavior.

## When to use
Containerization, Dockerfile review, deployment optimization, startup/shutdown issues, environment parity work.

## Inputs
Application, target runtime, base image policy, deployment platform, ports, health checks, resource limits.

## Context to inspect
Dockerfile, build context, layers, user, certificates/timezone/ICU needs, environment config, health endpoints, termination grace period.

## Core knowledge
Multi-stage builds reduce image size; non-root execution limits impact; immutable images separate build from config; containers need graceful SIGTERM handling; resource limits affect GC/thread behavior.

## Procedure
1. Use supported pinned-enough SDK/runtime base images per policy.
2. Separate restore/build/publish/runtime stages.
3. Optimize layer caching without copying secrets.
4. Run as non-root where platform allows.
5. Expose only required ports/files.
6. Keep configuration external.
7. Add meaningful readiness/liveness behavior.
8. Verify graceful shutdown.
9. Scan image/dependencies.
10. Test with realistic resource limits.

## Decision points
Use framework-dependent runtime images normally; self-contained/native AOT only when startup/size/deployment needs justify compatibility trade-offs.

## Common failure patterns
Secrets in layers, root containers, `latest` tags without policy, huge build context, health check that only returns 200, ignoring shutdown.

## Verification
Container build, vulnerability scan, startup/readiness test, SIGTERM test, resource-limited smoke/load test.

## Expected output
Reproducible, minimal, operable container deployment.

## Stop conditions
Escalate base-image exceptions, privileged containers, or production platform policy changes.