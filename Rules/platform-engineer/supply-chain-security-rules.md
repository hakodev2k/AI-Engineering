# Supply Chain Security Rules

## Purpose
Protect software delivery from compromised dependencies, build systems, artifacts, and provenance gaps.

## Scope
Applies to source, dependencies, CI runners, build images, registries, artifacts, signatures, and deployment inputs.

## MUST
- Production artifacts MUST be traceable to source revision and build process.
- Dependency and image vulnerabilities MUST be evaluated against risk policy.
- Build credentials MUST use least privilege and short-lived access where possible.
- Artifact promotion MUST preserve integrity and provenance.

## MUST NOT
- MUST NOT deploy untraceable or manually modified production artifacts.
- MUST NOT reuse privileged build credentials across unrelated trust domains.
- MUST NOT disable vulnerability or integrity gates without explicit risk approval.

## SHOULD
- Prefer signed artifacts and verifiable provenance.
- Pin or immutably resolve critical build inputs.

## Exceptions
Emergency acceptance requires documented exposure, owner, expiry, compensating controls, and remediation plan.

## Verification
Use SBOM/provenance inspection, vulnerability scans, signature checks, CI permission review, registry policy, and deployment attestation.