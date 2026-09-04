# Privileged Access Rules

## Purpose
Control administrative and high-impact access so elevated privilege is minimal, time-bounded, attributable, and recoverable.

## Scope
Applies to platform administrators, directory administrators, security administrators, database administrators, production operators, and equivalent privileged roles.

## MUST
- Privileged access MUST use dedicated privileged identities or equivalent separation from routine user activity.
- Standing privilege MUST be minimized and periodically justified.
- Elevation MUST be time-bounded where the platform supports just-in-time access.
- High-impact privilege assignments MUST require independent approval or equivalent controlled workflow.
- Privileged actions MUST generate auditable events linked to a specific identity.

## MUST NOT
- Shared administrative credentials MUST NOT be normal operating practice.
- Privileged access MUST NOT be granted solely because it is convenient for troubleshooting.
- Emergency privilege MUST NOT become permanent through inaction.

## SHOULD
- Privileged sessions SHOULD use hardened administration paths and phishing-resistant MFA.
- Sensitive elevation SHOULD capture reason or ticket context.

## Exceptions
Exceptions require documented risk, scope, duration, compensating controls, and accountable approval.

## Verification
Inspect privileged-role inventory, elevation logs, approval records, access reviews, session telemetry, and samples of emergency access use.