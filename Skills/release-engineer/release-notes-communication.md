# Release Notes and Communication

## Purpose
Communicate release impact accurately to operators, support teams, developers, and users without exposing irrelevant implementation noise.

## When to use
Use for production releases, public versions, breaking changes, migrations, deprecations, or operationally significant changes.

## Inputs
Change set, issue/PR metadata, user-visible behavior, compatibility changes, migration steps, known limitations, security disclosure policy, and audience list.

## Preconditions
The actual release artifact and included change range are known.

## Context to inspect
Inspect commits/PRs, issue tracker, API/schema changes, configuration requirements, deployment notes, known defects, and prior release notes conventions.

## Core knowledge
Different audiences need different information. Release notes should be derived from the exact shipped range and emphasize impact, action required, compatibility, risk, and recovery. Avoid leaking sensitive vulnerability details before coordinated disclosure.

## Procedure
1. Identify the exact previous and current release versions.
2. Derive included changes from authoritative source metadata.
3. Classify changes by user, operator, API, data, and security impact.
4. Highlight breaking or action-required changes first.
5. Document migrations, configuration, and deprecations.
6. State known limitations accurately.
7. Link to deeper technical evidence where appropriate.
8. Review sensitive security wording under disclosure policy.
9. Publish to the channels appropriate for each audience.
10. Correct notes when shipped reality differs from plan.

## Decision points
Generate routine summaries automatically but require review for breaking, regulated, or security-sensitive releases. Separate internal operator notes from public customer notes when audiences differ materially.

## Common failure patterns
Notes based on planned scope rather than shipped artifact, raw commit dumps, missing migration actions, claiming fixes not actually included, and disclosing exploit details prematurely.

## Verification
Cross-check notes against artifact/source range and acceptance evidence; have an affected operator or consumer verify required actions are understandable.

## Expected output
Accurate audience-specific release communication linked to the shipped version.

## Stop conditions
Stop publication when artifact scope is uncertain, breaking-change instructions are incomplete, or security disclosure requires approval.