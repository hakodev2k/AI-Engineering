# Command Structure Rules

## Purpose
Establish clear authority, accountability, and role boundaries during incidents.

## Scope
Applies from incident declaration through stabilization and handoff.

## MUST
- Assign one Incident Commander with explicit authority to coordinate the response.
- Separate command, technical investigation, communications, and scribe responsibilities when staffing permits.
- Make role ownership visible in the incident record.
- Transfer command explicitly, naming the outgoing and incoming commander and recording the handoff time.
- Keep the Incident Commander focused on coordination, priorities, risk, and decisions rather than deep implementation work.

## MUST NOT
- Allow multiple people to issue conflicting incident-wide priorities.
- Leave command ownership implicit during high-severity incidents.
- Let role transitions occur without acknowledgement from the receiving owner.

## SHOULD
- Add specialist leads for security, database, network, vendor, or customer response when domain complexity warrants it.
- Use deputies for long-running incidents to reduce fatigue.

## Exceptions
Small, low-severity incidents may combine roles when one responder can safely manage them; ownership must still be explicit.

## Verification
Inspect incident timelines, role assignments, handoff notes, and communications for a single active command owner and unambiguous responsibility boundaries.