# Architecture Boundary Rules
## Purpose
Protect system structure from accidental coupling and responsibility leakage.
## Scope
Modules, layers, services, domains, libraries, and integration boundaries.
## MUST
- Ownership and dependency direction MUST be explicit for important boundaries.
- Cross-boundary access MUST use intentional contracts rather than internal implementation details.
- Boundary changes MUST assess coupling, deployment, data, testing, and operational impact.
## MUST NOT
- Introduce circular dependencies or bypass established boundaries merely for implementation convenience.
- Share mutable persistence models as public contracts without deliberate approval.
## SHOULD
- Enforce critical boundaries with architecture tests or build rules where practical.
## Exceptions
Temporary boundary violations require owner, reason, expiry or remediation plan, and review.
## Verification
Inspect dependency graphs, architecture tests, imports/references, contracts, and design review evidence.