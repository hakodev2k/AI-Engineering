# Release Performance Validation Rules
## Purpose
Prevent releases from introducing unacceptable performance risk.
## Scope
Release gates, canaries, dependency/runtime upgrades, and post-deployment checks.
## MUST
- Validate critical performance paths before high-risk releases.
- Define post-deployment signals and rollback thresholds for material performance changes.
- Compare canary or post-release behavior against an appropriate baseline.
## MUST NOT
- Approve a known material regression without documented risk acceptance.
- Rely solely on pre-production tests when production topology materially differs and canary evidence is available.
## SHOULD
- Include performance checks in release criteria for historically sensitive paths.
## Exceptions
Emergency releases may defer full validation but require bounded monitoring and follow-up.
## Verification
Inspect release gates, benchmark results, canary dashboards, rollback criteria, and approvals.