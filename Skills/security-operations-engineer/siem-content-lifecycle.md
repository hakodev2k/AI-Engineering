# SIEM Content Lifecycle

## Purpose
Operate SIEM rules, parsers, dashboards and correlation content as engineered production assets rather than unmanaged queries.

## When to use
Use for onboarding, reviewing, migrating, tuning or retiring SIEM content.

## Inputs
Content inventory, rule metadata, telemetry sources, ownership, alert metrics, retention policy, platform limits and change history.

## Context to inspect
Review naming conventions, repositories, deployment pipeline, rule dependencies, parser versions, data costs, exceptions and incident links.

## Core knowledge
Detection content has dependencies and failure modes like software. Lifecycle controls require source control, testing, staged deployment, observability, ownership and retirement criteria.

## Procedure
1. Inventory active content and owners.
2. Classify by detection, enrichment, parsing, reporting or compliance purpose.
3. Identify duplicate and orphaned content.
4. Capture source/schema dependencies.
5. Establish versioned source-of-truth definitions.
6. Add syntax, schema and representative event tests.
7. Deploy through review and staged promotion.
8. Track execution failures, latency, firing rate and analyst outcomes.
9. Review exceptions and thresholds periodically.
10. Retire content when threat relevance, telemetry or ownership disappears.

## Decision points
Keep separate rules when response or ownership differs; consolidate when logic and triage are materially identical. Prefer platform-native features only when portability is not a material requirement.

## Common failure patterns
Editing only in the SIEM UI; no owner; stale field names; silent parser changes; duplicate alerts; perpetual temporary suppressions.

## Verification
Confirm repository and deployed versions match, tests pass, dependencies resolve, rule health is visible and retirement does not remove unique coverage.

## Expected output
Governed SIEM content with metadata, tests, deployment history, operational metrics and explicit ownership.

## Stop conditions
Stop before bulk migration or retirement if dependency mapping is incomplete or rollback is unavailable.