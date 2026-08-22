# Dependency and SDK Rules
## Purpose
Control supply-chain, privacy, stability, size, and lifecycle risks from third-party mobile dependencies.
## Scope
Libraries, analytics SDKs, ad SDKs, native packages, build plugins, and transitive dependencies.
## MUST
- New dependencies MUST have a documented need, maintenance/security assessment, license review, and ownership.
- SDK data collection and permissions MUST be reviewed before release.
- Dependency upgrades with material behavior changes MUST be tested on supported platforms.
## MUST NOT
- Abandoned or vulnerable packages MUST NOT remain on critical paths without documented mitigation.
- Third-party SDK initialization MUST NOT block startup unnecessarily.
## SHOULD
- Prefer smaller, actively maintained dependencies with narrow permissions and replaceable boundaries.
## Exceptions
Legacy dependencies may remain temporarily with risk acceptance and migration plan.
## Verification
Use dependency inventory, vulnerability/license scans, binary-size analysis, privacy inspection, and upgrade regression tests.