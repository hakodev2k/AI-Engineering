# Lifecycle Hooks

## intake-check
Trigger: new management request.
Action: verify objective, owner, urgency, stakeholder, decision needed, and source of truth. Reject ambiguous urgency labels without impact evidence.

## commitment-check
Trigger: before a delivery commitment.
Action: ensure capacity, critical dependencies, quality constraints, confidence, and escalation path are explicit.

## people-decision-check
Trigger: before formal performance, hiring, compensation, or role-change decisions.
Action: require role expectations, multi-source evidence, time window, bias check, and required Human approval.

## overload-check
Trigger: when active work changes.
Action: flag excess parallel initiatives, repeated interrupts, overloaded on-call ownership, and blocked work.

## completion-check
Trigger: before marking management work done.
Action: validate Definition of Done and ensure follow-up ownership exists.

Hooks MUST be deterministic, idempotent where possible, and MUST NOT perform irreversible actions.
