# ML Security and Secrets

## Purpose
Protect ML pipelines, artifacts, data, serving systems, and credentials against unauthorized access, tampering, exfiltration, and supply-chain compromise.

## When to use
Use when designing or reviewing training/serving infrastructure, third-party models, shared clusters, registries, or automated pipelines.

## Inputs
Architecture, identities, data classification, artifact sources, secrets, network paths, CI/CD, runtime permissions, threat model.

## Preconditions
Asset owners and sensitivity classifications are known.

## Context to inspect
IAM, service accounts, secret stores, network policy, registries, package sources, logs, build provenance, notebook access, and egress controls.

## Core knowledge
ML expands the attack surface through datasets, model files, notebooks, serialization, dependency ecosystems, and powerful compute identities. Treat models/artifacts as untrusted until provenance and format risks are assessed.

## Procedure
1. Inventory sensitive data, models, secrets, and privileged compute.
2. Map trust boundaries and identities.
3. Apply least-privilege service identities per workload.
4. Store secrets in approved secret managers and inject at runtime.
5. Restrict network ingress/egress.
6. Pin and scan dependencies and images.
7. Verify artifact provenance and signatures where supported.
8. Avoid unsafe deserialization formats when possible.
9. Audit access and privileged actions.
10. Test credential rotation and incident revocation.

## Decision points
Isolation level based on data/model sensitivity; external model ingestion requires stronger sandboxing and provenance controls.

## Common failure patterns
Cloud keys in notebooks, shared service accounts, public artifact buckets, unrestricted egress, arbitrary pickle loading, and production credentials available to training jobs.

## Verification
Attempt least-privilege access tests, rotate credentials, validate denied paths, and trace artifact provenance from source to deployment.

## Expected output
Threat model, IAM matrix, secret flow, artifact policy, network controls, and audit evidence.

## Stop conditions
Stop deployment on unknown artifact provenance, exposed secrets, excessive privilege, or unresolved critical vulnerabilities.