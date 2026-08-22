# Hotfix Containment Rules

## MUST
- Preserve incident ID, severity, confirmed symptom, evidence, and rollback plan in the hotfix plan.
- Restrict edits to `allowed_paths` unless a human explicitly expands scope.
- Add or run targeted regression checks for the affected behavior and at least one adjacent negative-control behavior.
- Preserve the first failing build/test/tool evidence before any retry.
- Give every temporary exception an owner, expiry timestamp, reason, and follow-up action.
- Use an independent reviewer for Sev0/Sev1 containment verification.
- Distinguish `implemented` from `verified`.
- Stop before production deployment, destructive rollback, schema changes, security weakening, secret changes, or infrastructure changes until explicit human approval exists.

## MUST NOT
- Mix unrelated refactoring, dependency upgrades, formatting sweeps, or cleanup into an incident hotfix.
- Widen a timeout, disable validation, bypass authorization, or suppress errors without recording it as an expiring exception.
- Treat a successful deploy command as proof of incident recovery.
- Delete or rewrite failing evidence after a later pass.
- Rerun semantic failures repeatedly to obtain a passing result.
- Modify rollback instructions after verification solely to make the gate pass.
- Allow the implementing agent to be the only verifier for Sev0/Sev1.
- Force push or rewrite history as part of containment automation.

## SHOULD
- Prefer reversible, localized changes with feature flags or guarded code paths when appropriate.
- Prefer tests that reproduce the original incident symptom before asserting the fix.
- Keep emergency exceptions shorter than the policy maximum.
- Convert temporary workarounds into tracked follow-up work after service restoration.