# Incident Readiness Rules

## Purpose
Ensure architecture supports rapid detection, containment, investigation, recovery, and evidence preservation during security incidents.

## Scope
Security incident preparation for applications, infrastructure, identity, data, cloud, and third-party dependencies.

## MUST
- Critical systems MUST define security incident contacts, containment options, logging dependencies, and recovery prerequisites.
- Architecture MUST support revoking credentials, isolating components, disabling integrations, and preserving evidence without requiring destructive improvisation.
- High-impact systems MUST have tested emergency access and recovery procedures.
- Incident-relevant telemetry MUST be retained long enough to support expected investigation timelines.
- Containment actions that can cause major outage or data loss MUST have explicit approval boundaries.

## MUST NOT
- MUST NOT design systems where the only containment option is full destructive shutdown when safer isolation is feasible.
- MUST NOT depend on compromised credentials for incident recovery.
- MUST NOT erase evidence during routine cleanup before preservation requirements are considered.

## SHOULD
- Prefer reversible containment actions and rehearsed incident playbooks for critical scenarios.

## Exceptions
Require documented operational constraint, residual incident risk, alternative evidence sources, and approval.

## Verification
Review playbooks, access paths, isolation controls, credential-revocation tests, logging retention, tabletop results, and recovery exercises.