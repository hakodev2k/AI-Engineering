# Scope and Authorization Rules

## Purpose
Ensure penetration testing remains explicitly authorized, bounded, and auditable.

## Scope
Applies before and during any security test against applications, APIs, networks, cloud resources, identities, endpoints, or physical/operational interfaces.

## MUST
- MUST obtain documented authorization identifying targets, allowed techniques, test window, data-handling constraints, emergency contacts, and stop conditions before active testing.
- MUST continuously verify that each target and action remains inside the approved scope.
- MUST distinguish passive analysis, validation, exploitation, persistence, and destructive actions when interpreting authorization.
- MUST stop and escalate when ownership, tenant boundaries, third-party dependencies, or scope are ambiguous.
- MUST preserve evidence showing what authorization governed the engagement.

## MUST NOT
- MUST NOT test an asset merely because it is discoverable, related, or technically reachable.
- MUST NOT pivot into third-party systems without explicit authorization.
- MUST NOT treat a vulnerability-disclosure policy as authorization for techniques it excludes.
- MUST NOT continue after an authorized stop request.

## SHOULD
- SHOULD use machine-readable target inventories and explicit exclusion lists where practical.
- SHOULD define conservative defaults for ambiguous cases.

## Exceptions
Exceptions require documented owner approval, rationale, risk, affected assets, duration, and compensating controls before execution.

## Verification
Review the signed authorization, scope inventory, test logs, timestamps, target identifiers, and escalation records. Confirm every active action maps to an authorized target and technique.