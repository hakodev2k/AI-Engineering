# Package and Patch Rules

## Purpose
Control software provenance, vulnerability remediation, compatibility, and fleet consistency.

## Scope
Applies to OS packages, repositories, patching, dependency locks, security updates, and package removal.

## MUST
- Packages MUST come from approved repositories with verifiable provenance and transport integrity.
- Security patches MUST be prioritized by exploitability, exposure, asset criticality, and vendor guidance rather than severity score alone.
- Patch deployment MUST define validation, rollout stages, failure criteria, and rollback or replacement strategy.
- Changes to libraries used by critical services MUST consider ABI/API compatibility and required service restarts.
- Pending security updates and reboot requirements MUST be visible in fleet reporting.

## MUST NOT
- Package signature verification MUST NOT be disabled to unblock installation.
- Production systems MUST NOT receive broad unattended package upgrades unless the rollout and recovery model has been explicitly designed for them.
- Vulnerable packages MUST NOT be declared remediated merely because a version string appears old; vendor backports and advisory status MUST be checked.

## SHOULD
- Minimize installed packages and remove unused repositories.
- Canary representative hosts before broad patch waves.
- Use reproducible images or configuration management to prevent long-lived patch divergence.

## Exceptions
Deferred patches require documented exposure analysis, compensating controls, owner, expiry date, and approval appropriate to risk.

## Verification
Inspect package sources and signatures, compare inventory to vendor advisories, validate restart/reboot status, review canary results, and confirm fleet compliance after rollout.