# Dependency Management Rules
## Purpose
Control dependency risk across developer tooling and shared workflows.
## Scope
Third-party packages, plugins, binaries, actions, images, and transitive dependencies.
## MUST
- Dependencies MUST have a justified purpose and compatible license/security posture.
- Reproducible workflows MUST pin or lock dependency resolution at an appropriate level.
- Critical dependency upgrades MUST be tested for behavior and compatibility.
- Known exploitable vulnerabilities MUST be triaged by impact and exposure.
## MUST NOT
- MUST NOT execute untrusted installation scripts with elevated privileges without review.
- MUST NOT suppress dependency security findings without documented disposition.
- MUST NOT add overlapping dependencies when an existing supported capability is sufficient without justification.
## SHOULD
- Dependency surface SHOULD be minimized.
- Automated update tooling SHOULD preserve review and validation gates.
## Exceptions
Exceptions require evidence, alternatives, risk, owner, review date, and security approval when exposure is material.
## Verification
Use lockfile review, SBOM/dependency inventory, vulnerability and license scans, upgrade tests, and CI provenance checks.