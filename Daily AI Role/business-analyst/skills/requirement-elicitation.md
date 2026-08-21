# Requirement Elicitation

## Purpose
Turn stakeholder goals, complaints, constraints, and assumptions into testable requirements without inventing missing business decisions.

## Trigger
New initiative, unclear request, change request, defect with ambiguous expected behavior, or conflicting stakeholder expectations.

## Inputs
Business objective, stakeholder list, current process, available evidence, constraints, deadlines, known decisions.

## Preconditions
Identify decision owners, source-of-truth artifacts, scope boundary, and whether regulated or sensitive data is involved.

## Procedure
1. Restate the business outcome and measurable success condition.
2. Separate facts, assumptions, decisions, questions, and risks.
3. Map stakeholder goals and conflicts.
4. Elicit happy path, alternatives, exceptions, permissions, data, timing, volume, and audit needs.
5. Capture business rules using unambiguous condition/action language.
6. Convert each requirement into observable behavior.
7. Link requirements to evidence and decision owners.
8. Resolve contradictions or escalate with explicit options and impact.
9. Baseline the agreed scope and unresolved questions.

## Decisions
Prefer clarification over inference when behavior changes money, permissions, compliance, irreversible data, customer commitments, or cross-team contracts.

## Outputs
Requirement set, assumptions log, open-questions log, decision log, scope boundary, stakeholder sign-off status.

## Quality criteria
Each requirement is necessary, atomic enough to verify, traceable, consistent, feasible to assess, and written in business-observable terms.

## Verification
Run `scripts/validate-requirements.py` on structured requirement JSON and perform stakeholder read-back.

## Failure handling
If answers conflict, do not merge silently. Record competing statements, evidence, owner, impact, and required decision.

## Stop conditions
Stop when acceptance can be tested, critical ambiguity is resolved or explicitly escalated, and scope ownership is clear.