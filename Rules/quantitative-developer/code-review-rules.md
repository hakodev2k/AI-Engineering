# Code Review Rules

## Purpose
Require expert challenge of quantitative correctness, operational risk, and maintainability before changes are accepted.

## Scope
Applies to pull requests and equivalent reviews for production or decision-grade quantitative code.

## MUST
- Reviews MUST evaluate financial semantics, units, temporal correctness, data assumptions, numerical behavior, failure handling, and tests relevant to the change.
- Material model changes MUST include evidence sufficient to assess before-and-after behavior.
- High-risk changes MUST receive review from someone independent of the implementation and competent in the affected domain.
- Reviewers MUST inspect generated or configuration changes when they can alter quantitative behavior.
- Unresolved correctness or safety concerns MUST block merge.

## MUST NOT
- Review MUST NOT be reduced to style or syntax when economic behavior changes.
- Authors MUST NOT approve their own changes where independent approval is required.
- Large opaque diffs MUST NOT bypass decomposition solely to meet delivery pressure.

## SHOULD
- Keep changes small enough to reason about and include focused evidence in the review description.
- Use automated checks for deterministic invariants and reserve human review for judgment-heavy risks.

## Exceptions
Emergency review exceptions require incident authority, documented scope, compensating validation, and retrospective review.

## Verification
Inspect approval records, reviewer expertise, test evidence, model comparisons, unresolved comments, diff size, and required status checks.