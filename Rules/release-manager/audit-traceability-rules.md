# Audit and Traceability Rules

## Purpose
Make release decisions and production actions reconstructable for incident analysis, compliance, accountability, and continuous improvement.

## Scope
Applies to release scope, evidence, approvals, execution records, exceptions, artifacts, and production outcomes.

## MUST
- Each release MUST have a durable identifier linking approved scope, candidate artifacts, risk, gates, approvals, execution, and validation evidence.
- Material decisions and exceptions MUST record who decided, what was decided, when, why, and the evidence available at that time.
- Production actions MUST be attributable to an authorized human or controlled automation identity where platform capability permits.
- Required records MUST be retained according to applicable policy and protected from unauthorized alteration.
- Audit records MUST distinguish planned actions from actions actually executed.

## MUST NOT
- Chat messages alone MUST NOT serve as the only durable record for safety-critical approvals or decisions.
- Audit history MUST NOT be rewritten or deleted merely to simplify release documentation.
- Missing evidence MUST NOT be replaced with reconstructed certainty after the fact; uncertainty must remain explicit.

## SHOULD
- Release systems SHOULD link records automatically using immutable identifiers.
- Evidence collection SHOULD minimize manual duplication while preserving independent verification where needed.

## Exceptions
Where systems cannot provide full attribution, document the limitation, alternate evidence, control owner, risk, and remediation plan.

## Verification
Trace a sampled release from requirement/change through artifact, gates, approvals, deployment events, exceptions, telemetry, and completion. Confirm timestamps, identities, and records are internally consistent.