# Dependency Safety Rules

## MUST
- Verify package compatibility before changing versions.
- Keep dependency changes isolated and reviewable.
- Run required builds and tests after upgrades.

## MUST NOT
- Upgrade production dependencies directly without approval.
- Remove failing tests to make upgrades pass.
- Ignore security or breaking-change notices.

## SHOULD
- Prefer incremental upgrades.
- Record migration decisions and evidence.
