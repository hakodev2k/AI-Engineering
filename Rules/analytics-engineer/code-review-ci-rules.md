# Code Review and CI Rules

## Purpose
Ensure analytical changes receive consistent peer review and automated validation before promotion.

## Scope
Applies to SQL, transformation code, semantic definitions, configuration, tests, documentation, and deployment metadata.

## MUST
- Pull requests MUST make semantic changes and expected output impact visible to reviewers.
- CI MUST run deterministic checks for syntax, compilation, tests, and other project-defined quality gates before merge.
- Reviewers MUST evaluate grain, join cardinality, metric semantics, schema compatibility, and operational impact when relevant.
- High-risk changes MUST include evidence such as before/after results, lineage impact, query plans, or reconciliations.
- Failed required CI checks MUST block merge unless an authorized exception explicitly accepts the risk.

## MUST NOT
- MUST NOT approve changes based solely on syntactic correctness when business semantics changed.
- MUST NOT bypass CI because a change is considered data-only or configuration-only.
- MUST NOT merge broad generated diffs without verifying the intended semantic effect.

## SHOULD
- Use automated linting, schema diffing, and targeted model selection to keep feedback fast and relevant.
- Require domain reviewers for critical metric or contract changes.

## Exceptions
Exceptions require documented reason, evidence, risk, and approval appropriate to the affected domain.

## Verification
Inspect pull requests, reviewer comments, CI results, test artifacts, impact evidence, and merge history.