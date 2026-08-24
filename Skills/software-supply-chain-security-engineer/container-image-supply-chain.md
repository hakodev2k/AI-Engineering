# Container Image Supply Chain Security

## Purpose
Ensure container images are built from controlled inputs, contain understood components, remain immutable, and are verified before execution.

## When to use
Use for containerized delivery platforms, base-image governance, registry design, or image compromise investigations.

## Inputs
Dockerfiles/build definitions, base images, registries, SBOMs, scanners, signatures, runtime policy, and deployment manifests.

## Context to inspect
Inspect base-image provenance, multi-stage builds, package installation, remote downloads, build secrets, image labels, registry permissions, tags, and admission controls.

## Core knowledge
Tags are mutable references; digests identify immutable image content. Security requires trusted base images, reproducible inputs, minimal contents, vulnerability management, signing/provenance, and runtime verification.

## Procedure
1. Inventory base images and their publishers.
2. Pin security-critical bases by digest while maintaining an update process.
3. Remove unnecessary packages, compilers, credentials, and build artifacts from final stages.
4. Verify remote downloads with authenticated integrity data.
5. Generate SBOM and vulnerability evidence from final images.
6. Sign images and attach provenance.
7. Restrict registry write/delete permissions.
8. Promote immutable digests between environments.
9. Enforce admission policy for approved registries, signatures, and provenance.
10. Continuously reassess deployed images for newly disclosed risk.

## Decision points
Distroless/minimal images reduce attack surface but may complicate diagnostics. Pinning must be paired with deliberate refresh automation to avoid permanent staleness.

## Common failure patterns
Deploying `latest`; copying package-manager credentials into layers; trusting scans of source rather than final images; mutable promotion tags; no verification at runtime.

## Verification
Inspect final layers, SBOM, digest, signature, and admission behavior. Test unsigned and altered images.

## Expected output
A controlled image lifecycle from trusted base to verified deployment.

## Stop conditions
Escalate on unknown base provenance, leaked build secrets, registry compromise indicators, or inability to enforce immutable production references.