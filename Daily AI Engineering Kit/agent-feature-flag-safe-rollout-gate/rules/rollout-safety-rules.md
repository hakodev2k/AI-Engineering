# Rollout Safety Rules

## MUST

- Every production-affecting flag MUST have an explicit owner, expiry date, kill switch, documented default, target environments, and verification metrics.
- Risky behavior changes MUST default to off unless explicit production approval exists.
- Production rollout MUST progress only through configured percentage steps and MUST pause at each checkpoint long enough to gather the declared verification evidence.
- The workflow MUST preserve the previous known-good flag state before changing rollout percentage or targeting.
- A rollout MUST define at least one rollback condition before expansion.
- Exposure decisions MUST be observable through logs, metrics, traces, or provider audit data without logging sensitive targeting attributes.
- A stale flag whose expiry date has passed MUST block new rollout work until ownership and cleanup are resolved.
- Any approval-required action MUST stop before mutation and record the missing approval.

## MUST NOT

- Do not increase production rollout above 25% without explicit human approval.
- Do not remove or bypass a kill switch while a rollout is active.
- Do not change a production flag default from false to true without approval.
- Do not use secrets, passwords, raw access tokens, health data, or other sensitive values as flag targeting attributes.
- Do not silently widen targeting rules when a requested cohort cannot be identified.
- Do not continue a rollout after rollback thresholds are exceeded.
- Do not delete stale flags automatically from production configuration; cleanup is an approval-required code/config change.
- Do not claim rollout success from configuration mutation alone.

## SHOULD

- Prefer stable identifiers and deterministic hashing for percentage rollout.
- Prefer small cohorts before broad percentage expansion.
- Prefer independent verification by a verifier that did not make the rollout change.
- Remove temporary flags after full rollout once the rollback window has safely passed.
- Keep flag evaluation logic close to the behavioral branch and avoid cascading unrelated flags.
