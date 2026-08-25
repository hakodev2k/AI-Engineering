# Canary and Progressive Release
## Purpose
Use mesh traffic controls to reduce release blast radius without hiding application risk.
## Scope
Weighted routing, header routing, canaries, blue-green transitions, and rollback.
## MUST
- Canary cohorts MUST be explicitly defined and observable.
- Promotion MUST use predetermined health criteria and comparison windows.
- Rollback MUST be executable without requiring the failing version to respond correctly.
## MUST NOT
- MUST NOT promote solely because infrastructure health is green when application SLIs regress.
- MUST NOT use sticky or header routing that unintentionally exposes privileged cohorts.
- MUST NOT change release and mesh policy simultaneously without isolating causal risk.
## SHOULD
- Traffic increments SHOULD reflect service criticality and failure cost.
## Exceptions
Immediate broad rollout requires documented urgency and approval.
## Verification
Inspect route weights, cohort telemetry, comparative SLIs, rollback tests, and final route state.