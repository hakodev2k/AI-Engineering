# Dependency and Supply Chain Rules

## Purpose
Control risk introduced by third-party packages, build inputs, registries, artifacts, and dependency lifecycle decisions.

## Scope
Applies to direct/transitive dependencies, package managers, registries, build plugins, generated artifacts, and third-party code.

## MUST
- Dependencies MUST have a legitimate product or engineering purpose and an identifiable maintenance source.
- Security-relevant dependency changes MUST be reviewed for provenance, permissions/capabilities, transitive impact, and known risk.
- Builds MUST use deterministic or locked dependency resolution where the ecosystem supports it.
- Known exploitable vulnerabilities MUST be triaged using reachability, exposure, impact, exploitability, and available mitigations rather than CVSS alone.
- Artifact and package sources MUST be constrained to approved registries or verified origins appropriate to the project.
- High-risk dependency upgrades MUST have regression, compatibility, and rollback planning.

## MUST NOT
- MUST NOT suppress vulnerability findings indefinitely without owner, rationale, evidence, and review date.
- MUST NOT install unreviewed packages merely to avoid implementing a small, security-sensitive function.
- MUST NOT execute package/build scripts from untrusted sources in privileged CI environments.

## SHOULD
- SHOULD minimize dependency count and privilege, especially in security-critical paths.
- SHOULD maintain software-component inventory/SBOM where operationally useful or required.

## Exceptions
Exceptions require documented vulnerability or provenance assessment, compensating controls, owner, expiry, and approval.

## Verification
Use lockfile review, dependency/SCA scanning, provenance checks, registry configuration, SBOM inspection, CI policy, and targeted review of high-risk packages.