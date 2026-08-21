# Dependency Governance Rules
## Purpose
Control security, compatibility, operational, and maintenance risk from dependencies.
## Scope
Libraries, frameworks, SDKs, services, and major version upgrades.
## MUST
- New critical dependencies MUST have justified capability, ownership, support posture, license suitability, and exit implications.
- Major upgrades MUST assess breaking changes, migration effort, runtime impact, and rollback.
- Known critical vulnerabilities MUST have explicit disposition and owner.
## MUST NOT
- Add a dependency solely to avoid implementing trivial stable functionality without considering lifecycle cost.
- Perform large dependency migrations without review and staged verification.
## SHOULD
- Keep dependency surfaces minimal and versions intentionally maintained.
## Exceptions
Urgent security upgrades may accelerate normal review but still require validation and rollback planning.
## Verification
Inspect manifests, lockfiles, vulnerability reports, licenses, upgrade tests, and design records.