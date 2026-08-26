# Configuration as Code Rules

## Purpose
Make important flag definitions reviewable, reproducible, and resistant to configuration drift.

## Scope
Declarative flag metadata, environments, policies, and automation-managed configuration.

## MUST
- Configuration-as-code changes MUST be reviewable and validated before production application.
- Environment-specific values MUST be explicit and must not accidentally promote production exposure from lower environments.
- Automation MUST detect or reconcile material drift according to documented policy.
- Sensitive values MUST use secret-management mechanisms rather than plaintext repository storage.

## MUST NOT
- Generated configuration MUST NOT overwrite unauthorized manual emergency changes without reconciliation logic.
- Production identifiers MUST NOT be copied blindly across isolated environments.
- Forceful reconciliation MUST NOT destroy unknown state without impact review.

## SHOULD
- Schemas SHOULD validate type, owner, lifecycle, and targeting constraints in CI.

## Exceptions
Console-only emergency changes require audit evidence and subsequent reconciliation.

## Verification
Inspect repository history, CI validation, drift reports, environment diffs, and secret scans.