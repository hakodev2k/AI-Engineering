# Flaky Test Governance Rules

## MUST

- Preserve the first failing artifact before any rerun.
- Record every diagnostic rerun outcome, including passes.
- Keep reruns within `config/flaky-test-policy.json` unless a human explicitly approves an exception.
- Treat `product-regression` and `unknown` as blocking classifications.
- Require owner, issue/work item, evidence, created date, expiry, and classification for every quarantine entry.
- Require human approval for critical-path quarantine when policy says so.
- Keep quarantined failures visible in CI/reporting.
- Revalidate quarantine before expiry; expired entries must fail the quarantine gate.
- Distinguish `task completed` from `task verified`.
- Run deterministic registry validation after changing quarantine metadata.

## MUST NOT

- Rerun until green and discard earlier failures.
- Mark a test flaky solely because it passed once after failing.
- Quarantine a reproducible product regression.
- Quarantine a test whose classification remains `unknown`.
- Add permanent quarantine without expiry.
- Remove or disable tests to obtain a green build unless the task explicitly requires deletion and a human approves it.
- Broaden quarantine from one test to a whole suite without separate evidence and approval.
- Modify production data, production configuration, database schema, secrets, infrastructure, security controls, or public API contracts without explicit human approval.
- Force push or delete files as part of this workflow by default.
- Let the investigator approve its own quarantine decision when an independent reviewer is available.

## SHOULD

- Prefer controlled discriminating experiments over repeated identical runs.
- Prefer fixing deterministic state/timing problems immediately when the fix is small and evidence is strong.
- Use the shortest reasonable quarantine duration.
- Include run IDs, artifact paths, failure signatures, environment details, and recent change references in evidence.
- Track quarantine count and age as engineering-health signals.
- Repair the underlying cause before increasing retry counts or timeouts.
- Remove quarantine only after repeated-run verification demonstrates stability under representative conditions.
