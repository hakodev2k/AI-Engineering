# GPU Container Workload Rules

## Purpose
Ensure containerized GPU workloads are reproducible, compatible, isolated, and operable across accelerator fleets.

## Scope
Applies to container images, runtime hooks, device exposure, image provenance, filesystem mounts, and GPU workload packaging.

## MUST
- GPU workload images MUST pin or constrain material runtime dependencies sufficiently to reproduce supported execution.
- Images MUST be built from approved, traceable base images and scanned for known vulnerabilities according to project policy.
- Device exposure MUST be limited to the accelerators and capabilities required by the workload.
- Container runtime configuration MUST preserve host security boundaries and supported driver integration.
- Image changes affecting GPU libraries MUST pass representative accelerator tests before production promotion.

## MUST NOT
- Privileged containers MUST NOT be the default mechanism for enabling GPU access.
- Host driver libraries MUST NOT be arbitrarily overwritten from workload containers.
- Mutable image tags MUST NOT be the sole identity for production-critical deployments.

## SHOULD
- Images SHOULD separate frequently changing application layers from large stable runtime layers where this improves distribution efficiency.
- Diagnostic tooling SHOULD be available without embedding unnecessary administrative capabilities.

## Exceptions
Exceptions require documented need, risk, compensating controls, expiration, and approval when isolation is weakened.

## Verification
Inspect image manifests, digests, scans, runtime configuration, device mounts, privilege settings, and workload compatibility tests.