# Privacy Code Review and Release Gates

## Purpose
Apply repeatable privacy-focused engineering review to code and configuration changes that affect AI data collection, model calls, training pipelines, retrieval, observability, retention, or user controls.

## When to use
Use for pull requests and release reviews involving personal data, new model/provider integrations, data-schema changes, logging changes, dataset builders, user personalization, or privacy-control logic.

## Inputs
- Code diff and repository context
- Architecture and data-flow documentation
- Data classifications
- Privacy requirements and approved design
- Tests and deployment configuration

## Context to inspect
Inspect changed code plus upstream callers and downstream consumers, configuration defaults, environment overrides, schemas, migrations, queues, logs, SDK behavior, feature flags, and tests.

## Core knowledge
Privacy defects often arise at integration boundaries: an added field reaches telemetry, a new model provider receives a broader payload, a cache bypasses deletion, or a client-controlled filter weakens tenant isolation. Senior review evaluates behavior and lifecycle, not merely whether obvious identifiers appear in the diff.

## Procedure
1. Identify what processing behavior changes, not only what files changed.
2. Determine whether new personal or sensitive data is collected, derived, retained, or disclosed.
3. Trace changed fields through storage, logs, queues, providers, and outputs.
4. Verify minimization and purpose alignment.
5. Review authorization and tenant scoping for every data-bearing path.
6. Check retention and deletion implications.
7. Inspect new vendor/provider defaults and telemetry.
8. Review error handling for accidental payload logging.
9. Verify preference and privacy-control enforcement.
10. Require tests for isolation, redaction, deletion, and negative cases relevant to the change.
11. Compare deployment configuration with secure/privacy-preserving defaults.
12. Record blocking findings separately from follow-up improvements.
13. Re-review after material fixes.

## Decision points
Block release when the change creates unapproved data use, weakens isolation, exposes sensitive content, bypasses deletion/preferences, or depends on unverifiable provider behavior. Use follow-up actions rather than blocking when residual risk is low, bounded, and explicitly owned.

## Common failure patterns
- Reviewing only the diff without tracing data downstream
- Accepting client-side authorization filters
- Missing observability side effects
- Treating test success as proof that privacy requirements were tested
- Allowing temporary debug logging into production
- Approving a provider change without checking configuration defaults

## Verification
Run targeted tests against representative sensitive data, inspect emitted logs and external payloads, test denied-access cases, verify deletion/preference behavior, and confirm release configuration matches reviewed settings.

## Expected output
A privacy review record with blocking issues, rationale, required tests, residual risks, evidence, and an explicit release recommendation.

## Stop conditions
Stop and escalate when requirements are ambiguous, the change involves high-impact processing outside reviewer authority, production configuration cannot be inspected, or a blocking privacy defect remains unresolved.