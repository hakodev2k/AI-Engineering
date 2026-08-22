# ML Security and Privacy

## Purpose
Reduce security and privacy risk across datasets, training, artifacts, serving, and model outputs.

## When to use
During ML architecture reviews, data onboarding, deployment, and incident response.

## Inputs
Data classifications, threat model, identities, storage, pipelines, model artifacts, serving endpoints, retention requirements.

## Context to inspect
Access paths, secrets, dependency supply chain, sensitive attributes, artifact permissions, logging, untrusted inputs, output exposure.

## Core knowledge
ML expands the attack surface through valuable datasets/models and data-dependent behavior. Apply least privilege, data minimization, provenance, isolation, and defense in depth.

## Procedure
1. Classify training and inference data.
2. Map trust boundaries and privileged identities.
3. Minimize collected/stored sensitive data.
4. Protect secrets and encrypt sensitive storage/transit.
5. Restrict dataset, registry, and endpoint permissions.
6. Validate provenance and dependencies.
7. Test malformed/adversarial inputs appropriate to the use case.
8. Prevent sensitive data leakage in logs/artifacts.
9. Define retention, deletion, and incident procedures.

## Decision points
Use stronger privacy techniques when threat/regulatory requirements justify utility cost. Isolate untrusted processing rather than relying on validation alone.

## Common failure patterns
Public model buckets, secrets in notebooks, PII in experiment logs, overly broad service accounts, and unverified training sources.

## Verification
Access tests enforce least privilege; secret/data scans pass; sensitive deletion and incident paths are exercised.

## Expected output
Security controls, privacy handling rules, and verified risk mitigations.

## Stop conditions
Block use when data rights, provenance, or mandatory privacy controls cannot be established.