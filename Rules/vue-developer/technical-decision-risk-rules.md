# Technical Decision and Risk Rules

## Purpose
Ensure Senior Vue decisions are explicit, evidence-based, reversible where possible, and proportionate to user and production risk.

## Scope
Architecture, framework patterns, dependencies, performance, security, migrations, and high-impact implementation choices.

## MUST
- Significant decisions MUST state the problem, constraints, alternatives considered, trade-offs, and verification evidence appropriate to impact.
- Unknowns that can materially change the decision MUST be investigated or explicitly recorded as accepted risk.
- Irreversible or expensive-to-reverse choices MUST receive deeper review than local reversible implementation choices.
- Recommendations MUST distinguish measured facts, assumptions, and professional judgment.
- Actions affecting production security controls, public contracts, sensitive data handling, or irreversible user impact MUST require authorized human approval before execution.

## MUST NOT
- Agent or reviewer confidence MUST NOT be treated as evidence.
- Framework popularity MUST NOT be the sole justification for architectural change.
- A temporary workaround MUST NOT become an undocumented permanent boundary violation.

## SHOULD
- Prefer the simplest reversible option that satisfies current verified constraints.
- Record decisions near the codebase or architecture documentation when future maintainers will need the context.

## Exceptions
Urgent incident mitigation may precede full analysis when immediate harm reduction is necessary; rationale, residual risk, and follow-up decision review remain mandatory.

## Verification
Review decision records, linked measurements/tests, approvals, unresolved assumptions, and whether implementation matches the accepted trade-offs.