# Change and Release Rules

## Purpose
Make BI production changes reversible, validated, and visible to affected consumers.

## Scope
Applies to schemas, transformations, semantic models, metrics, reports, schedules, and platform configuration.

## MUST
- Production changes MUST identify affected downstream assets and consumer impact before release.
- Breaking schema or metric changes MUST use a migration, compatibility, or coordinated cutover strategy.
- High-impact releases MUST define rollback or forward-fix procedures before execution.
- Released assets MUST be validated in the target environment using representative checks.

## MUST NOT
- MUST NOT delete or rename shared production fields without dependency analysis.
- MUST NOT execute irreversible production changes without explicit human approval.

## SHOULD
- Releases SHOULD be small enough to isolate failures and SHOULD preserve backward compatibility where practical.

## Exceptions
Exceptions require documented urgency, impact, alternatives, recovery plan, and authorized approval.

## Verification
Review diffs, dependency reports, release checklist, approval evidence, deployment logs, and post-release validation.