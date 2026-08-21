# Skill: Interaction Design

**Purpose:** convert a validated problem frame into coherent task flows and behavior specifications.
**Trigger:** a user task needs a new or changed interaction.
**Inputs:** problem frame, evidence, constraints, platform conventions, design system, dependencies.
**Preconditions:** user/outcome and decision authority are known.
**Context/tools:** current product, flow diagrams, wireframes/prototypes, content/system-state references.

## Steps
1. Define entry conditions, user goal, completion condition, and cancellation/recovery paths.
2. Model primary task flow before screen detail.
3. Enumerate loading, empty, partial, validation, error, permission, timeout, conflict, interruption, retry, cancellation, and success states as relevant.
4. Minimize unnecessary choices, memory load, and irreversible actions.
5. Reuse established patterns unless divergence improves a material user constraint.
6. Specify behavior, state transitions, content intent, persistence, validation timing, and feedback.
7. Review feasibility with Engineering without dictating architecture.
8. Record alternatives and trade-offs.

## Decisions
Choose the option with best task success and risk profile under known constraints, not the most novel UI.

## Constraints
No fabricated evidence; no final scope or architecture authority.

## Output
Task flow, state matrix, behavior specification, decision record, validation plan.

## Quality/verification
Trace each critical decision to evidence or explicit assumption; run consistency/accessibility/usability reviews.

## Failure/stop
Two materially different redesign attempts maximum before escalation on unresolved core constraints. Stop when review gates pass and handoff is actionable.
