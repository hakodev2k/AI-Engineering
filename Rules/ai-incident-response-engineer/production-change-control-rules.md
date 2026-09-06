# Production Change Control Rules

## Purpose
Prevent incident response from introducing uncontrolled production risk.

## Scope
Applies to emergency and planned changes made during active AI incidents.

## MUST
- Every production change MUST identify actor, rationale, intended effect, scope, validation, and rollback path when reversible.
- Destructive data actions, irreversible migrations, secret rotation, broad access changes, security-control weakening, and breaking public-contract changes MUST require explicit human approval from authorized owners.
- Changes during an incident MUST be minimized to those necessary for containment, diagnosis, or recovery.
- Concurrent changes MUST be coordinated so their effects remain attributable.
- Emergency changes MUST receive retrospective review after stabilization.
- Configuration and policy changes MUST be captured in an auditable diff or equivalent record.

## MUST NOT
- Force pushes or history rewriting MUST NOT be used to hide incident changes.
- Responders MUST NOT execute production changes outside their granted authority.
- Multiple speculative fixes MUST NOT be bundled when doing so prevents causal verification.

## SHOULD
- Prefer reversible, scoped, progressively deployable changes.
- Freeze unrelated high-risk changes during severe incidents when operationally appropriate.

## Exceptions
Immediate containment may precede normal approval only where incident policy explicitly grants that authority and delay creates greater risk.

## Verification
Review change logs, Git/configuration diffs, approvals, deployment records, audit trails, and rollback evidence.