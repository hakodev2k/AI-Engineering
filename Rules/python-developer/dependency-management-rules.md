# Dependency Management Rules
## Purpose
Control supply-chain, compatibility, and reproducibility risk.
## Scope
Runtime and development dependencies.
## MUST
- Direct dependencies MUST have an explicit purpose and compatible version policy.
- Production builds MUST be reproducible from committed dependency metadata.
- Security and license impact MUST be reviewed for material new dependencies.
## MUST NOT
- MUST NOT add packages solely to avoid implementing trivial stable functionality.
- MUST NOT perform large dependency upgrades without compatibility and rollback assessment.
## SHOULD
- Keep dependency surface minimal and remove unused packages.
## Exceptions
Urgent security upgrades may accelerate normal review with documented validation.
## Verification
Lockfile diff, dependency audit, CI, and vulnerability scanning.