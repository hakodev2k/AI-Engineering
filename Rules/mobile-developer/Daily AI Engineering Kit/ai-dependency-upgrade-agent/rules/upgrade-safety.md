# Upgrade Safety Rules

## MUST
- Inspect breaking changes before upgrades.
- Keep dependency changes isolated.
- Run automated verification.

## MUST NOT
- Upgrade production dependencies without approval.
- Remove tests to make builds pass.
- Ignore security warnings.

## SHOULD
- Prefer incremental upgrades.
- Preserve rollback path.
