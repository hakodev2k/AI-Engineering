# Bundle and Dependency Rules
## Purpose
Control shipped code size, supply-chain risk, compatibility, and maintenance burden.
## Scope
Packages, framework plugins, polyfills, bundling, code splitting, and dependency upgrades.
## MUST
- New runtime dependencies MUST justify capability, maintenance health, security posture, bundle/runtime cost, and license compatibility.
- Dependency upgrades with breaking or security-sensitive impact MUST be tested on affected critical paths.
- Large optional features SHOULD be split from initial delivery when evidence shows startup benefit and UX remains correct.
- Lockfiles and deterministic dependency resolution MUST be maintained where the toolchain supports them.
## MUST NOT
- Vulnerability warnings MUST NOT be suppressed without documented risk assessment.
- Equivalent libraries MUST NOT proliferate without a migration or ownership rationale.
## SHOULD
- Prefer platform/framework capability over adding a dependency for trivial behavior.
## Exceptions
Temporary duplicate dependencies require owner, rationale, and removal plan.
## Verification
Dependency audit, license/security scan, bundle analysis, lockfile diff, and compatibility tests.