# Safety Rules

## MUST
- Preserve existing behavior unless the upgrade requires change.
- Record evidence for compatibility decisions.
- Run verification after changes.

## MUST NOT
- Modify production configuration automatically.
- Remove security controls to make builds pass.
- Upgrade multiple unrelated dependencies without approval.
- Commit secrets.

## SHOULD
- Prefer smallest safe upgrade.
- Separate investigation from implementation.
