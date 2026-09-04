# Consent, Preferences, and Purpose Enforcement

## Purpose
Translate user privacy choices and approved processing purposes into enforceable technical controls across AI data collection, training, personalization, inference, analytics, and retention.

## When to use
Use when products offer consent, opt-out, personalization preferences, model-training choices, or purpose-specific data use. Revisit when new secondary uses are proposed.

## Inputs
- Product requirements and privacy notices
- Consent/preference states
- Processing-purpose definitions
- Data flows and storage systems
- Training and inference pipelines

## Context to inspect
Inspect preference stores, ingestion gates, feature flags, event pipelines, dataset builders, personalization services, model-training filters, deletion jobs, and downstream exports.

## Core knowledge
A user-facing choice has value only when it is propagated to every relevant processing path. Purpose limitation should be represented in system design through policy metadata, access controls, data partitioning, or pipeline gates rather than informal developer conventions.

## Procedure
1. Enumerate each user choice and the processing it controls.
2. Define canonical preference states and precedence rules.
3. Identify every system that consumes affected data.
4. Propagate preference or purpose metadata to those systems.
5. Gate collection and processing at the earliest reliable point.
6. Exclude disallowed records from future training and analytics builds.
7. Define behavior for data already present when a preference changes.
8. Ensure caches, replicas, and third-party processors receive required updates.
9. Add audit events for preference changes and enforcement actions.
10. Test race conditions and delayed propagation.
11. Document exceptions and approved overrides.
12. Monitor enforcement failures.

## Decision points
Prefer deny-by-default when preference state is unavailable for high-risk processing. Use centralized policy evaluation when many services must interpret the same choice; use local enforcement only with strict shared semantics and test coverage.

## Common failure patterns
- Updating UI state without backend enforcement
- Applying opt-out only to future collection but not dataset refreshes
- Inconsistent preference semantics across services
- Missing third-party propagation
- Using stale cached preferences

## Verification
Change preferences in controlled tests and trace resulting behavior through ingestion, training eligibility, personalization, exports, and retention. Verify audit evidence and failure alerts.

## Expected output
A tested preference-to-processing enforcement design with canonical states, propagation paths, gates, exception handling, and auditability.

## Stop conditions
Escalate when a user choice cannot be propagated reliably, existing data treatment is unresolved, or legal/product semantics conflict across jurisdictions.