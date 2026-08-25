# Change Management

## Purpose
Prevent infrastructure and policy changes from silently reducing recoverability.

## Scope
Backup software, repositories, agents, policies, credentials, networks, upgrades, migrations, and configuration.

## MUST
- Changes affecting recovery capability MUST include impact analysis, validation, rollback or recovery plan, and accountable approval proportional to risk.
- Major upgrades and repository migrations MUST preserve required restore points or provide an approved transition strategy.
- Protection MUST be revalidated after material application, platform, identity, or network changes.
- Emergency changes MUST be recorded and retrospectively reviewed.

## MUST NOT
- MUST NOT perform destructive repository, retention, or configuration changes without human approval.
- MUST NOT remove the only proven recovery path before its replacement is validated.
- MUST NOT assume backup compatibility across upgrades without evidence.

## SHOULD
- Configuration SHOULD be version-controlled and peer-reviewed where supported.

## Exceptions
Emergency deviations require bounded scope, incident/change authority, audit trail, and post-change validation.

## Verification
Inspect change records, diffs, approvals, rollback plans, post-change tests, compatibility evidence, and restore validation.