# Container Image Security

## Purpose
Reduce workload risk by controlling image provenance, contents, privileges, and lifecycle.

## When to use
Use in image build pipelines, registry policy, workload onboarding, vulnerability response, and release gates.

## Inputs
Dockerfiles/build definitions, image manifests, SBOMs, vulnerability reports, registry metadata, signing/provenance data, and runtime requirements.

## Preconditions
Identify authoritative registries, base-image owners, and severity/remediation policy.

## Context to inspect
Inspect base images, package layers, user configuration, capabilities, embedded secrets, mutable tags, signatures, provenance, SBOMs, and end-of-life dependencies.

## Core knowledge
Image security combines minimal attack surface, reproducibility, provenance, vulnerability management, and runtime constraints. A clean scanner result does not establish trustworthy provenance.

## Procedure
1. Trace image source and build pipeline.
2. Pin trusted bases and dependencies appropriately.
3. Remove build tools/secrets from runtime layers.
4. Configure non-root execution where feasible.
5. Generate and retain SBOM/provenance.
6. Scan for vulnerabilities and secrets.
7. Sign or attest release artifacts.
8. Enforce trusted registry/provenance at admission.
9. Define rebuild cadence and emergency patch process.

## Decision points
Prefer minimal maintained bases over smallest possible unmaintained images. Block vulnerabilities based on exploitability, exposure, and policy rather than severity alone.

## Common failure patterns
Using latest tags; trusting public images implicitly; ignoring transitive packages; embedding credentials; scanning only after deployment.

## Verification
Rebuild and verify digest, provenance, signature, SBOM, vulnerability policy, and runtime user settings.

## Expected output
A traceable, policy-compliant image with evidence from source through admission.

## Stop conditions
Block release for untrusted provenance, exposed secrets, or unacceptable exploitable vulnerabilities without approved mitigation.