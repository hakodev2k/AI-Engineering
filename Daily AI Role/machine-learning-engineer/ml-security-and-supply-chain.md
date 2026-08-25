# ML Security and Supply Chain

## Purpose
Reduce security risk across datasets, model artifacts, dependencies, training infrastructure and inference interfaces.

## When to use
Use during design reviews, dependency/model onboarding and production readiness.

## Inputs
Threat model, data sources, model sources, dependencies, runtime permissions, endpoints and secrets handling.

## Context to inspect
Artifact provenance, serialization formats, network access, CI/CD identity, storage ACLs and third-party licenses.

## Core knowledge
Models and datasets are executable-adjacent supply-chain assets. Unsafe deserialization, poisoned data, stolen artifacts, dependency compromise and abusive inference inputs require explicit controls.

## Procedure
1. Identify assets, trust boundaries and threat actors.
2. Verify provenance and integrity of external models/data.
3. Prefer safe serialization formats; avoid loading untrusted executable objects.
4. Pin and scan dependencies and container images.
5. Apply least privilege to training and serving identities.
6. Keep secrets out of code, datasets and artifacts.
7. Restrict network/storage access to required resources.
8. Validate and bound inference inputs.
9. Log security-relevant artifact and deployment events.
10. Define response procedures for compromised data/model/dependency.

## Decision points
Sandbox untrusted conversion steps. Accept external artifacts only when provenance, license and risk controls satisfy policy.

## Common failure patterns
Loading arbitrary pickle files, broad cloud credentials, public artifact buckets, secrets in notebooks and unsigned/untraceable models.

## Verification
Run dependency/artifact checks, permission reviews, malicious-input tests and provenance tracing.

## Expected output
Documented ML threat controls with verifiable provenance and least privilege.

## Stop conditions
Stop ingestion/deployment for untrusted executable artifacts, unknown provenance or critical unresolved vulnerabilities.