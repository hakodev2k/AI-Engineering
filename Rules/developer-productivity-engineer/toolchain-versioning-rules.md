# Toolchain Versioning Rules
## Purpose
Control compatibility and migration risk across shared engineering tools.
## Scope
Compilers, runtimes, package managers, linters, generators, and developer CLIs.
## MUST
- Supported versions MUST be machine-readable where practical and documented for humans.
- Major upgrades MUST assess compatibility, rollback, CI images, local environments, and generated output changes.
- Version resolution MUST fail clearly when an unsupported tool is detected.
- Broad migrations MUST have staged adoption evidence before mandatory rollout.
## MUST NOT
- MUST NOT silently float critical tool versions across builds.
- MUST NOT remove the previous supported path before rollback risk is understood.
## SHOULD
- Upgrade automation SHOULD separate mechanical changes from semantic changes.
## Exceptions
Emergency security upgrades may accelerate rollout with explicit risk acceptance and validation.
## Verification
Inspect lock/version files, run compatibility matrix checks, and test upgrade plus rollback paths.