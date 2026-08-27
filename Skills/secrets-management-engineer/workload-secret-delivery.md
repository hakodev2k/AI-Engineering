# Workload Secret Delivery

## Purpose
Deliver secrets to workloads with minimal plaintext exposure, reliable refresh, and clear failure behavior.

## When to use
Use when choosing between SDK retrieval, sidecars, agents, mounted files, injected environment variables, or platform-native secret delivery.

## Inputs
- Workload runtime
- Secret types
- Refresh requirements
- Failure tolerance
- Platform capabilities

## Context to inspect
Inspect application startup, process environment, filesystem permissions, container boundaries, logging, crash dumps, caching, deployment tooling, and secret-store authentication.

## Core knowledge
Delivery method changes exposure. Environment variables are simple but may leak through diagnostics and generally refresh poorly. Files can support rotation but require atomic updates and permissions. Runtime retrieval improves freshness but creates availability dependencies.

## Procedure
1. Identify which secrets the workload actually requires.
2. Determine whether values must refresh without restart.
3. Evaluate runtime retrieval, agent/sidecar, mounted-file, and environment approaches.
4. Choose the method with the smallest practical plaintext surface.
5. Authenticate the workload using a non-secret or short-lived identity mechanism.
6. Configure local permissions and memory/cache lifetime.
7. Implement safe refresh and atomic replacement.
8. Define behavior when the secret store is unavailable.
9. Prevent values from entering logs, traces, dumps, or metrics.
10. Test startup, rotation, restart, and outage scenarios.

## Decision points
Prefer runtime retrieval or managed file delivery when rotation matters. Use environment variables only when platform constraints justify them and exposure is accepted. Cache only enough to meet resilience requirements.

## Common failure patterns
- Secrets in command-line arguments
- World-readable mounted files
- Restart-only rotation with no operational plan
- Logging retrieved values during debugging
- Unlimited local caching

## Verification
Verify least-privilege retrieval, local access permissions, refresh timing, outage behavior, and absence of secret values in diagnostic surfaces.

## Expected output
A documented delivery pattern with authentication, refresh, local protection, resilience, and verification evidence.

## Stop conditions
Stop when the runtime cannot protect secret material adequately, rotation requirements conflict with application behavior, or availability assumptions are undefined.