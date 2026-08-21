# Code Review Rules

## Purpose
Define Senior-level review behavior that protects correctness, architecture, security, performance, operability, and maintainability.

## Scope
Applies to pull requests, change sets, refactors, dependency updates, migrations, and production fixes.

## MUST
- Reviewers MUST understand the intended behavior, affected boundaries, and risk before approving material changes.
- Reviews MUST evaluate correctness, failure handling, security, performance, data impact, compatibility, observability, and tests when relevant.
- High-risk changes MUST include evidence such as tests, benchmarks, query plans, migration SQL, logs, or design rationale appropriate to the risk.
- Review comments MUST distinguish blocking correctness/safety issues from suggestions and preferences.
- Large or mixed-purpose changes SHOULD be split when reviewability or rollback safety materially improves.
- Reviewer approval MUST NOT substitute for required automated or runtime verification.

## MUST NOT
- MUST NOT approve a change solely because it compiles or tests are green.
- MUST NOT block changes on personal style preferences already covered by formatter/analyzer policy.
- MUST NOT ignore unexplained public contract, migration, permission, or dependency changes.
- MUST NOT self-approve high-risk changes when independent review is required by project policy.

## SHOULD
- Prefer comments that explain risk and desired outcome rather than prescribing unnecessary implementation detail.
- Re-read the final diff after substantial revisions.

## Exceptions
Expedited review requires documented urgency, risk acceptance, minimum verification evidence, and post-change follow-up.

## Verification
Inspect the final diff, CI evidence, review threads, tests, migration/configuration changes, and required approvals before merge.