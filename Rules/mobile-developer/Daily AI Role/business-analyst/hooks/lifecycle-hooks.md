# Lifecycle Hooks

Hooks are deterministic checkpoints; they do not make business decisions.

## on-intake
Normalize request ID, requester, objective, deadline, risk, source, and scope status. Reject missing objective as incomplete intake.

## before-baseline
Check stable IDs, decision owner, unresolved blockers, acceptance coverage, traceability, and approval requirement.

## after-change
Mark related acceptance, process, traceability, and handoff artifacts `review-required` until revalidated.

## before-handoff
Verify no blocking ambiguity, required approvals recorded, dependencies owned, and Definition of Done passed.

## on-blocked
Record blocker, owner, requested decision/input, impact, escalation path, and next review point. Repeated invocation MUST update the same blocker record rather than create duplicates.

## on-completion
Produce completion evidence and preserve superseded versions where auditability is required.