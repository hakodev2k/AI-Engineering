# ML Container and Runtime Hardening

## Purpose
Reduce attack surface and blast radius in training and inference containers and their runtime environments.

## When to use
Use for containerizing ML workloads, reviewing GPU images, onboarding third-party images, or hardening production serving/training.

## Inputs
Dockerfiles/images, runtime configuration, package inventory, GPU/runtime requirements, filesystem needs, network dependencies, and orchestrator policies.

## Preconditions
Establish functional resource and driver requirements before removing privileges.

## Context to inspect
Inspect base images, package managers, native libraries, CUDA/runtime layers, entrypoints, users, mounts, capabilities, devices, network access, and image provenance.

## Core knowledge
ML images are often large and privileged because of drivers and tooling. Size increases vulnerability surface. GPU/device access does not imply the workload needs root. Build-time tools should usually be excluded from runtime images.

## Procedure
1. Inventory runtime dependencies and required devices.
2. Select a trusted minimal compatible base image.
3. Pin image and package versions/digests.
4. Use multi-stage builds to exclude compilers and credentials.
5. Run as a non-root user where supported.
6. Drop unnecessary Linux capabilities and privilege escalation.
7. Use read-only filesystem and explicit writable mounts when feasible.
8. Restrict host mounts and device exposure.
9. Apply outbound network restrictions appropriate to workload needs.
10. Scan packages and image provenance.
11. Set CPU/memory/GPU resource limits and timeouts.
12. Test model loading, observability, and failure behavior under hardened settings.

## Decision points
Retain a package/tool only when runtime operation or supportability requires it. Use separate debug images rather than shipping production shells/toolchains by default. Grant device access narrowly.

## Common failure patterns
Running as root for convenience; mounting host Docker socket; embedding cloud keys; shipping build caches; `latest` base images; privileged containers to solve driver problems; unrestricted egress from untrusted model-loading jobs.

## Verification
Inspect final image contents, runtime user/capabilities/mounts, vulnerability findings, network policy, and resource limits. Confirm representative inference/training succeeds without privileged fallbacks.

## Expected output
A hardened runtime image and deployment policy with documented exceptions and verification evidence.

## Stop conditions
Stop if required driver behavior is unclear, hardening breaks safety-critical monitoring, or privilege exceptions lack an accountable owner.