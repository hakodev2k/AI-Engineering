# Inference Security Hardening

## Purpose
Reduce attack surface of model-serving infrastructure and protect model artifacts, credentials, and inference data.

## When to use
Use before production exposure, during security review, or after runtime/dependency changes.

## Inputs
Threat model, deployment topology, runtime, container/image, network policy, secrets, artifact sources, and data classification.

## Context to inspect
Ingress, authentication, model-loading paths, remote-code options, filesystem mounts, container privileges, egress, logs, and dependency provenance.

## Core knowledge
Inference servers process untrusted inputs and often run powerful native/GPU stacks. Model repositories may contain executable/custom code. Least privilege, immutable artifacts, network segmentation, and dependency control are essential.

## Procedure
1. Threat-model clients, control plane, artifact supply chain, runtime, and observability sinks.
2. Require authenticated, authorized access and bounded request sizes.
3. Disable arbitrary remote code/model loading unless explicitly approved.
4. Pin and verify artifacts and container dependencies.
5. Run non-root with minimal capabilities, mounts, devices, and egress.
6. Store secrets outside images/config repositories and rotate them.
7. Prevent prompt/response leakage through logs, traces, crash dumps, and metrics.
8. Patch runtime/driver vulnerabilities through tested rollout procedures.
9. Test abuse cases, malformed requests, and unauthorized model access.

## Decision points
Use stronger workload isolation for untrusted tenants or custom model code. Accept egress only for documented operational dependencies.

## Common failure patterns
Public unauthenticated endpoints, trust_remote_code by default, writable model stores, secrets in environment dumps, and raw prompts in logs.

## Verification
Security scans, policy tests, least-privilege review, access tests, and artifact integrity checks must pass.

## Expected output
Hardened deployment plus residual-risk record.

## Stop conditions
Do not launch with unresolved critical vulnerabilities, unknown artifact provenance, or missing authentication on exposed services.