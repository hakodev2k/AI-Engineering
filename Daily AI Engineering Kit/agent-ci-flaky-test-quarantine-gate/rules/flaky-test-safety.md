# Flaky-Test Safety Rules

## MUST
- Preserve the exact revision SHA for every counted observation.
- Require both pass and fail outcomes before classifying a test as flaky.
- Enforce `max_test_reruns` from policy.
- Exclude infrastructure/tool failures from test outcome counts and preserve them separately.
- Check protected patterns before proposing quarantine.
- Record a quarantine owner, reason, evidence path, and removal criterion.
- Require independent verification before quarantine removal.
- Stop for explicit approval before changing required CI checks, protected tests, security controls, production configuration, database schema/data, or public API contracts.
- Keep secrets and credentials out of evidence artifacts.

## MUST NOT
- Retry until CI becomes green.
- Mark a consistently failing test flaky.
- Change assertions, sleeps, timeouts, retries, or test ordering solely to hide a failure.
- Disable an entire suite when one test is implicated unless explicitly approved.
- Quarantine tests matching `protected_test_patterns`.
- Count observations from different revisions as evidence of nondeterminism for one revision.
- Force-push, rewrite history, deploy, or modify production resources as part of this workflow.
- Silently increase tool permissions.

## SHOULD
- Reproduce at the smallest test scope first.
- Prefer deterministic clocks, seeded randomness, isolated state, and explicit synchronization over retry-based fixes.
- Normalize failure signatures so repeated deterministic failures are easy to recognize.
- Keep quarantine duration short and attach an accountable owner.
- Run the containing suite after isolated recovery succeeds.
