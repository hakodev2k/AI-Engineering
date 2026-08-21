# Platform Testing Rules

## Purpose
Require evidence that platform changes preserve contracts, safety, and operability before broad rollout.

## Scope
Applies to platform APIs, templates, controllers, provisioning workflows, policies, upgrades, and shared runtime services.

## MUST
- Critical platform workflows MUST have automated tests covering success and important failure paths.
- Contract, authorization, and policy behavior MUST be tested at trusted boundaries.
- High-risk changes MUST be validated in representative environments before production rollout.
- Regression tests MUST be added for platform defects when a deterministic test can prevent recurrence.

## MUST NOT
- MUST NOT treat unit tests alone as sufficient evidence for changes whose risk exists only in integration or runtime behavior.
- MUST NOT disable failing safety tests merely to complete a release.
- MUST NOT claim production readiness when required verification evidence is missing.

## SHOULD
- Prefer deterministic tests and isolated fixtures.
- Include rollback, retry, quota, and partial-failure scenarios for critical workflows.

## Exceptions
Manual verification may substitute only when automation is impractical; scope, evidence, reviewer, and follow-up automation opportunity MUST be recorded.

## Verification
Use CI results, contract tests, integration tests, end-to-end tests, security tests, policy tests, failure injection, and reviewed evidence.