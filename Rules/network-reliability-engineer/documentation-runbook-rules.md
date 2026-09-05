# Documentation and Runbook Rules

## Purpose
Keep operational knowledge sufficient for safe diagnosis, recovery, and handoff under pressure.

## Scope
Topology documentation, service ownership, dependency maps, maintenance procedures, troubleshooting guides, and incident runbooks.

## MUST
- Critical network services MUST have current ownership, dependency, and escalation documentation.
- Runbooks MUST state prerequisites, expected observations, decision points, and rollback or stop conditions for high-risk actions.
- Architecture documentation MUST be updated when changes materially alter traffic paths or failure domains.
- Operational documents MUST distinguish verified facts from assumptions and historical guidance.

## MUST NOT
- MUST NOT rely on undocumented tribal knowledge for critical recovery procedures.
- MUST NOT keep obsolete procedures marked as current.
- MUST NOT publish credentials or sensitive access material in ordinary runbooks.

## SHOULD
- Validate important runbooks during drills or real incidents.
- Prefer concise procedures linked to authoritative configuration and telemetry sources.

## Exceptions
Temporary documentation gaps require an owner and dated remediation plan.

## Verification
Review document freshness, ownership metadata, incident usage, drill outcomes, and alignment with current topology.