# Feature Flag and Rollout Rules
## Purpose
Use controlled exposure without creating unmanaged operational risk.
## Scope
Feature flags, kill switches, canaries, cohorts, regional rollout, experimentation, and staged activation.
## MUST
- High-risk flags MUST have an owner, default state, activation plan, failure behavior, and removal plan.
- Rollout stages MUST have measurable success and abort criteria.
- Kill switches MUST be tested before being relied on as primary mitigation.
- Flag evaluation failure behavior MUST be safe and documented.
- Exposure increases MUST be based on observed production evidence.
## MUST NOT
- A flag MUST NOT be treated as rollback if data or schema changes remain incompatible.
- Permanent behavior MUST NOT accumulate behind unmanaged stale flags.
- Rollout MUST NOT expand while critical health signals are degraded or ambiguous.
## SHOULD
- Start with internal, low-risk, or small-cohort exposure where practical.
- Automate stale-flag detection and ownership review.
## Exceptions
Immediate full exposure requires rationale, risk assessment, evidence, and authorized approval when progressive rollout was expected.
## Verification
Inspect configuration, ownership, cohorts, telemetry, kill-switch tests, activation history, and cleanup tracking.