# Backlog and Acceptance Rules

## Purpose
Keep implementation work aligned with a clear problem, bounded scope, verifiable acceptance criteria, accountable decisions, and explicit handling of risk and change.

## Scope
Applies to backlog items, defects, experiments, technical work, acceptance decisions, reprioritization, release scope, and stakeholder clarifications.

## MUST
- State the intended user, business or operational outcome, scope boundary, and acceptance criteria before work is accepted into an implementation commitment.
- Make acceptance criteria observable and testable, including relevant error, permission, accessibility, privacy, performance, migration, and rollback expectations.
- Record material assumptions, dependencies, open decisions, and the owner and due date for each unresolved item.
- Reprioritize with the reason, expected impact, affected commitments, and decision owner visible to the delivery team.
- Obtain required stakeholder approval before accepting a scope, policy, data, financial, legal, or customer-impacting decision that exceeds the product owner's delegated authority.
- Preserve a traceable link between the delivered behavior, acceptance evidence, and any approved scope change.

## MUST NOT
- MUST NOT represent a vague request, stakeholder preference, or implementation proposal as validated acceptance criteria.
- MUST NOT accept work while knowingly hiding a material dependency, risk, operational handoff, accessibility impact, or non-functional requirement.
- MUST NOT change a committed outcome or accept a workaround as complete without recording the decision, impact, and approval required by the target organization.
- MUST NOT use velocity, delivery pressure, or a demo alone as evidence that the intended outcome was achieved.

## SHOULD
- SHOULD keep items small enough to test and reverse independently where practical.
- SHOULD use examples, prototypes, measurable hypotheses, and negative cases to remove ambiguous interpretations before implementation.
- SHOULD involve engineering, design, security, operations, and support early when their constraints affect acceptance.

## Exceptions
An exception requires the exact criterion or readiness condition being waived, reason, affected users or systems, risk and mitigation, approver, temporary acceptance boundary, and follow-up date. Emergency work still requires a post-change record and review.

## Verification
Confirm that every accepted item has a named outcome, testable criteria, documented assumptions/dependencies, appropriate approvals, delivered evidence, residual-risk statement, and a clear disposition for deferred work.
