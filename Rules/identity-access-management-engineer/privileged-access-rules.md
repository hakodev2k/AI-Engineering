# Privileged Access Rules

## Purpose
Control administrative capabilities whose misuse can materially affect security or production.

## Scope
Administrative roles, root-equivalent access, privilege elevation, privileged sessions, break-glass access, and admin tooling.

## MUST
- Privileged access MUST use dedicated identities or clearly separated privileged contexts.
- Elevation MUST be attributable, approved according to risk, time-bounded, and logged.
- Privileged sessions MUST use stronger authentication than ordinary low-risk access where supported.
- Standing privilege MUST be periodically justified and minimized.

## MUST NOT
- MUST NOT embed privileged credentials in scripts, source, tickets, or chat.
- MUST NOT use break-glass accounts for routine administration.
- MUST NOT execute high-risk privilege changes without required human approval.

## SHOULD
- Prefer just-in-time access, session recording for critical systems, and dual control for catastrophic actions.

## Exceptions
Emergency access requires incident linkage, explicit reason, post-use credential handling, review, and remediation.

## Verification
Inspect elevation records, privileged-role inventory, session logs, authentication policy, emergency-use records, and access reviews.