# Regression Rules
## Purpose
Prevent fixed or previously stable behavior from failing unnoticed after change.
## Scope
Regression suites, selection, maintenance, and change-impact coverage.
## MUST
- Select regression coverage from changed behavior, dependencies, critical journeys, defect history, and architecture impact.
- Add durable protection for significant escaped defects when economically appropriate.
- Remove or repair obsolete tests whose results no longer represent supported behavior.
## MUST NOT
- Run a large suite blindly and treat its pass result as proof that relevant regression risk was covered.
- Keep permanently skipped critical tests without explicit risk ownership.
## SHOULD
- Optimize suites for fast feedback while retaining deeper scheduled coverage where needed.
## Exceptions
Coverage may be deferred with documented risk, alternative evidence, and follow-up owner.
## Verification
Inspect change-to-regression mapping, skipped tests, escaped regressions, suite duration, and maintenance history.