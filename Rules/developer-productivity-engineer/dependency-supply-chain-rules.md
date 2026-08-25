# Dependency Supply Chain Rules
## Purpose
Protect developer tooling from compromised or uncontrolled dependencies.
## Scope
Packages, plugins, actions, images, binaries, and transitive dependencies.
## MUST
- Third-party tooling MUST come from approved or verifiable sources with integrity controls where available.
- Dependency changes MUST be reviewable and scanned for known vulnerabilities and license constraints as applicable.
- CI and developer automation MUST minimize execution of untrusted install scripts.
- Critical dependency upgrades MUST include compatibility evidence.
## MUST NOT
- MUST NOT embed registry tokens or signing secrets in repository content.
- MUST NOT disable integrity or signature checks solely to unblock installation.
## SHOULD
- Dependencies SHOULD be minimized and pinned according to ecosystem best practice.
## Exceptions
Unverified sources require security approval, provenance evidence, containment, and replacement plan.
## Verification
Inspect lockfiles, provenance/signatures, scanner results, permissions, and dependency diffs.