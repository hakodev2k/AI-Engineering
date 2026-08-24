# Cloud Software Supply Chain Security

## Purpose
Protect cloud deployments from compromised source, dependencies, build systems, artifacts, and deployment identities.

## When to use
Use for CI/CD design, artifact pipelines, dependency incidents, build hardening, or provenance requirements.

## Inputs
Repositories, CI workflows, dependency manifests, build runners, registries, signing systems, deployment roles, and artifact metadata.

## Context to inspect
Inspect branch protection, workflow permissions, third-party actions, runner isolation, dependency pinning, artifact provenance, registry policies, and deployment credentials.

## Core knowledge
Trust must be established from source through build to deployment. Minimize mutable dependencies and privileged build identities; verify provenance at promotion boundaries.

## Procedure
1. Map source-to-production trust chain.
2. Protect privileged branches and review paths.
3. Pin and verify third-party build dependencies.
4. Isolate untrusted builds from secrets.
5. Use short-lived CI identities.
6. Generate immutable artifacts once.
7. Produce and retain provenance/SBOM where useful.
8. Sign artifacts and verify before deployment.
9. Restrict registry mutation and deployment roles.
10. Test compromised-dependency and unauthorized-artifact scenarios.

## Decision points
Use stronger signing/provenance gates for high-impact environments; avoid adding ceremony that cannot be operationally maintained.

## Common failure patterns
Mutable action tags, shared runners with secrets, rebuilding per environment, unsigned artifacts, and CI roles with administrator permissions.

## Verification
Trace a production artifact to reviewed source and build evidence; prove unsigned or unauthorized artifacts cannot deploy.

## Expected output
A verifiable software supply chain with bounded identities and artifact provenance.

## Stop conditions
Escalate if build integrity is uncertain, signing keys may be compromised, or production provenance cannot be established.