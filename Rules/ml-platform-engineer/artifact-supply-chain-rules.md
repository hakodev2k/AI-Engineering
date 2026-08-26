# Artifact Supply Chain

## Purpose
Preserve integrity and provenance of code, containers, models, packages, and ML artifacts.

## Scope
Build, storage, transfer, dependency, signing, and consumption paths.

## MUST
- Production artifacts MUST be content-addressed, checksummed, or equivalently immutable.
- Builds MUST record source revision and dependency/runtime identity.
- Vulnerability and dependency policy MUST be enforced before privileged production use.
- Artifact repositories MUST enforce access and retention policy.

## MUST NOT
- Production systems MUST NOT execute artifacts whose integrity cannot be established.
- Mutable tags MUST NOT substitute for immutable deployment identity.

## SHOULD
- High-risk artifacts SHOULD use signed provenance and verified build attestations where practical.

## Exceptions
Emergency use of an unverified dependency requires risk approval, containment, and a time-bounded remediation plan.

## Verification
Inspect digests, SBOM/provenance records, dependency scans, registry policy, access logs, signature checks, and deployed artifact identities.