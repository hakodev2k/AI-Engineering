# Control Design Rules

## Purpose
Ensure compliance controls are specific, proportionate, implementable, and verifiable.

## Scope
Applies to preventive, detective, corrective, and compensating controls implemented in software, infrastructure, process, or governance.

## MUST
- Every control MUST state the risk or obligation it addresses, its owner, expected behavior, and verification method.
- Controls MUST be designed at the strongest practical layer rather than relying only on manual behavior when deterministic enforcement is feasible.
- Control dependencies and assumptions MUST be documented when failure of another control can invalidate compliance.
- High-risk controls MUST define failure handling and escalation.

## MUST NOT
- MUST NOT use aspirational statements as substitutes for enforceable controls.
- MUST NOT create duplicate controls with conflicting ownership or evidence requirements.

## SHOULD
- Prefer simple controls with clear failure modes over complex control chains that are difficult to audit.

## Exceptions
Alternative control designs require documented rationale, comparative risk, evidence plan, and approval.

## Verification
Inspect control specifications, implementation design, automated checks, ownership records, and review evidence.