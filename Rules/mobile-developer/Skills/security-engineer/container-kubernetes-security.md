# Container and Kubernetes Security

## Purpose
Secure containerized workloads and Kubernetes environments against image, runtime, identity, network, and cluster-control risks.

## When to use
Use for container platforms, Kubernetes deployments, admission-policy design, runtime hardening, or cluster security reviews.

## Inputs
Container images, Dockerfiles, manifests/Helm charts, cluster configuration, IAM/RBAC, network policies, registries, CI/CD pipeline.

## Context to inspect
Base images, image provenance, package vulnerabilities, container users/capabilities, secrets, service accounts, RBAC, admission controls, network policies, pod security, registry permissions, and node exposure.

## Core knowledge
Containers share the host kernel and are not a complete security boundary. Kubernetes security depends on workload identity, least-privilege RBAC, restricted pod privileges, trusted images, network segmentation, and secure control-plane configuration.

## Procedure
1. Review image sources, signatures/provenance, and vulnerability status.
2. Minimize base images and remove unnecessary tools/packages.
3. Run as non-root and drop unnecessary Linux capabilities.
4. Enforce read-only filesystems and resource limits where practical.
5. Inspect service accounts and RBAC for least privilege.
6. Restrict privileged pods, host mounts, host networking, and dangerous capabilities.
7. Define network policies between workloads and sensitive services.
8. Protect secrets and registry credentials.
9. Add admission or policy-as-code controls for critical invariants.
10. Monitor runtime anomalies, audit events, and image drift.

## Decision points
Use stronger sandboxing or isolation for untrusted workloads. Cluster-wide privileges require explicit justification and review.

## Common failure patterns
Running as root, privileged containers, wildcard RBAC, default service-account tokens everywhere, mutable image tags, public registries without provenance controls, and no network policies.

## Verification
Policy tests reject intentionally unsafe manifests, RBAC negative tests pass, images are traceable to approved sources, and runtime/audit telemetry captures high-risk actions.

## Expected output
A hardened container/Kubernetes posture with enforceable workload, identity, image, and network controls.

## Stop conditions
Escalate when changes affect shared cluster administration, require node-level privileges, or could disrupt critical workloads without a rollout plan.