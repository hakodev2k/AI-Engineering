# Software Supply Chain Security

## Purpose
Protect build artifacts from tampering, dependency compromise, and untraceable provenance.

## When to use
Use for CI hardening, artifact signing, dependency governance, registry security, or release integrity.

## Inputs
Build workflows, dependencies, registries, package feeds, signing systems, deployment policy.

## Context to inspect
Workflow permissions, third-party actions, lockfiles, package sources, artifact digests, provenance, signing keys, SBOM generation.

## Core knowledge
Secure the path from source commit to deployed artifact. Pin dependencies/actions, minimize CI privilege, isolate untrusted code, generate provenance/SBOM, and verify artifact identity at deploy time.

## Procedure
1. Map source-to-artifact trust chain.
2. Pin actions/tools/dependencies.
3. Restrict workflow token permissions.
4. Separate pull-request builds from privileged release jobs.
5. Generate immutable artifacts and digests.
6. Produce SBOM/provenance.
7. Sign artifacts with protected identity/key.
8. Verify signature/provenance before deployment.
9. Scan dependencies and images.
10. Define emergency revocation procedure.

## Decision points
Prefer keyless workload signing when supported; block critical known vulnerabilities based on exploitability and policy; isolate self-hosted runners carefully.

## Common failure patterns
Mutable action tags, broad CI tokens, secrets exposed to forks, unsigned artifacts, registry overwrite, missing provenance.

## Verification
A deployment rejects tampered or unsigned artifact and provenance links back to expected source/build.

## Expected output
Auditable artifact trust chain with enforceable release controls.

## Stop conditions
Stop release when artifact integrity or provenance cannot be established.