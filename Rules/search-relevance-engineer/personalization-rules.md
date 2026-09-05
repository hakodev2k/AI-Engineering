# Personalization Rules

## Purpose
Use personalization only when it improves user outcomes without violating privacy, fairness, or predictability.

## Scope
Applies to user, account, session, geographic, and behavioral personalization signals.

## MUST
- Personalization inputs MUST have a documented purpose, retention basis, and allowed use.
- Personalized ranking MUST preserve hard filters, permissions, and safety constraints.
- Relevance evaluation MUST include personalized and non-personalized baselines for affected segments.
- Users lacking sufficient history MUST have a safe deterministic fallback.

## MUST NOT
- MUST NOT use sensitive attributes unless explicitly authorized for a legitimate purpose and reviewed for risk.
- MUST NOT leak one user's behavior into another user's results.
- MUST NOT make personalization impossible to disable when product or regulatory requirements require control.

## SHOULD
- Limit personalization to signals with demonstrated incremental value.

## Exceptions
Require documented purpose, privacy review, evidence, risk, and approval.

## Verification
Inspect feature lineage, access controls, experiments, fallback tests, privacy reviews, and segment metrics.