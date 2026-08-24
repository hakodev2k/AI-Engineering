# Container Cloud Security

## Purpose
Secure containerized cloud workloads from image build through runtime and orchestration.

## When to use
Use for container platforms, managed Kubernetes, image pipelines, runtime hardening, or container incidents.

## Inputs
Dockerfiles, images, registries, manifests, runtime policies, identities, network policy, and vulnerability reports.

## Context to inspect
Inspect base images, package provenance, image signatures, registry permissions, pod/task privileges, mounts, capabilities, service accounts, and runtime telemetry.

## Core knowledge
Reduce image contents and privileges, establish provenance, separate build from runtime trust, and enforce controls at admission/runtime where appropriate.

## Procedure
1. Review base image provenance and patch status.
2. Remove unnecessary packages and secrets.
3. Run as non-root where feasible.
4. Drop unnecessary capabilities and writable mounts.
5. Constrain workload identity and network access.
6. Scan and sign images.
7. Enforce trusted-image admission policy.
8. Protect registry permissions.
9. Add runtime detection for anomalous behavior.
10. Test rollout and rollback.

## Decision points
Prioritize exploitable vulnerabilities over raw CVE count. Use immutable rebuilds rather than patching running containers.

## Common failure patterns
Privileged containers, latest tags, secrets baked into layers, shared service accounts, writable host mounts, and unsigned images.

## Verification
Inspect effective runtime settings, verify signature enforcement, test denied privileged deployment, and confirm patched image provenance.

## Expected output
Hardened container supply and runtime controls with reproducible evidence.

## Stop conditions
Escalate when hardening breaks required kernel/device access or a discovered vulnerability appears actively exploited.