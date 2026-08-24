# Code Review and Change Safety Rules

## Purpose
Make Android changes reviewable, reversible, and proportional to production risk.

## Scope
Applies to pull requests, refactoring, risky changes, migrations, and reviewer evidence.

## MUST
- State behavior change, risk, verification evidence, and rollout implications for material changes.
- Separate unrelated refactoring from risky behavioral changes when doing so materially improves reviewability.
- Review changes affecting authentication, data deletion, migrations, exported components, signing, permissions, or production configuration with appropriate senior/security ownership.
- Preserve backward compatibility for persisted data and server contracts unless an approved migration exists.
- Require explicit approval before irreversible user-data changes, force pushes/history rewriting, or weakened security controls.

## MUST NOT
- Merge because tests pass when relevant risks are not covered by those tests.
- Hide generated, configuration, manifest, or dependency changes from review context.
- Claim a bug is fixed without reproduction or bounded evidence when such evidence is obtainable.

## SHOULD
- Keep changes small enough to reason about and roll back.
- Record non-obvious trade-offs near the decision source.

## Exceptions
Emergency fixes may use expedited review but require documented risk, authorization, and follow-up verification.

## Verification
Inspect diffs, CI results, test evidence, manifest/dependency changes, migration compatibility, approvals, and release plan.