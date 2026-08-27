# Code Review Rules

## Purpose
Ensure Senior-level review catches correctness, security, scalability, and operational risk before release.

## Scope
Applies to Apex, LWC, metadata, integrations, schema changes, and deployment-related pull requests.

## MUST
- Reviews MUST assess behavior, security context, governor-limit risk, data integrity, test evidence, and production impact where relevant.
- Reviewers MUST inspect changed dependencies and automation interactions, not only modified lines.
- High-risk changes MUST include explicit evidence for rollback, validation, and authorization boundaries.
- Significant architectural decisions MUST document alternatives and trade-offs.

## MUST NOT
- MUST NOT approve solely because tests pass or code coverage is sufficient.
- MUST NOT ignore warnings about security, data loss, or scalability without documented resolution.
- MUST NOT combine unrelated risky changes when separation would materially improve reviewability.

## SHOULD
- Reviews SHOULD prefer small, cohesive changes with clear intent.
- Repeated review findings SHOULD be converted into automated checks or reusable rules where practical.

## Exceptions
Exceptions require reason, risk, compensating verification, and named approval.

## Verification
Inspect pull-request evidence, reviewer comments, CI checks, security findings, test scope, and release notes.