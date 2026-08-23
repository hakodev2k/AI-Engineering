# Incident Command Rules

## Purpose
Establish clear authority, priorities, and coordination during production incidents.

## Scope
SEV incidents, major service degradation, security-adjacent operational events, and cross-team response.

## MUST
- Assign one incident commander for every material incident and make the role visible to responders.
- Establish severity, customer impact, current hypotheses, active mitigations, owners, and next decision time.
- Keep command focused on impact reduction, responder coordination, and explicit decisions rather than personally debugging every subsystem.
- Transfer command explicitly with acknowledgement and current-state handoff.
- Record consequential decisions and their evidence during the incident.

## MUST NOT
- Allow multiple people to independently direct responders without a declared command structure.
- Let seniority override the incident commander implicitly.
- Execute irreversible or high-risk production actions without the required human approval and rollback assessment.

## SHOULD
- Delegate operations, communications, investigation, and subject-matter work to named roles when incident scale warrants it.
- Rotate command when fatigue materially threatens judgment.

## Exceptions
A single responder may temporarily fill multiple roles for a small incident, but command ownership and decision logging remain mandatory.

## Verification
Review the incident timeline for a named commander, explicit role transitions, decision ownership, approvals, and current-state updates.