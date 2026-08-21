# Requirement Traceability Rules

## Purpose
Ensure architecture decisions remain connected to business goals, constraints, and measurable requirements.

## Scope
Applies to solution design, architecture reviews, change proposals, migrations, and major integrations.

## MUST
- Significant architecture decisions MUST trace to explicit functional requirements, non-functional requirements, constraints, or risk controls.
- Ambiguous requirements that materially affect architecture MUST be clarified or recorded as assumptions before final design approval.
- Assumptions MUST identify owner, impact, validation method, and expiry or review point when relevant.
- Architecture deliverables MUST distinguish confirmed requirements from inferred needs and recommendations.
- Requirements that conflict with security, compliance, reliability, or platform constraints MUST be escalated rather than silently ignored.

## MUST NOT
- MUST NOT invent requirements to justify a preferred technology or architecture style.
- MUST NOT treat stakeholder preference as a hard requirement without documenting rationale and alternatives.
- MUST NOT mark architecture complete while critical unresolved requirements can materially change the design.

## SHOULD
- Use a traceability table for high-impact systems linking requirement → decision → component → verification.
- Prefer measurable requirements over subjective statements such as “fast” or “highly available.”

## Exceptions
Low-risk exploratory prototypes may use temporary assumptions when clearly labeled and prevented from becoming production defaults without review.

## Verification
Review requirement-to-decision mappings, assumption logs, unresolved questions, acceptance criteria, and architecture review records.