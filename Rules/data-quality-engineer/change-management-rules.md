# Data Quality Change Management Rules
## Purpose
Prevent releases and source changes from degrading trusted data.
## Scope
Schema, logic, dependencies, thresholds, source onboarding, and deprecation.
## MUST
- Material changes MUST identify affected quality contracts, tests, lineage, consumers, and rollback strategy.
- Quality checks MUST be updated before or with behavior-changing releases.
- High-risk changes MUST be validated against representative historical or shadow data where practical.
## MUST NOT
- MUST NOT remove quality coverage merely because a changed implementation fails existing checks without proving the checks obsolete.
- MUST NOT introduce breaking data behavior without approved migration.
## SHOULD
- Changes SHOULD be staged and reversible when blast radius is uncertain.
## Exceptions
Emergency changes require documented risk, approval, monitoring, and retrospective validation.
## Verification
Review diffs, impact analysis, test changes, shadow comparisons, rollout evidence, and approvals.