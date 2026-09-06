# Human-in-the-Loop and Approvals

## Purpose
Design human review and approval steps that add real control without becoming opaque bottlenecks or rubber-stamp gates.

## When to use
Use for high-impact decisions, uncertain AI outputs, policy exceptions, financial actions, access changes, customer-facing escalations, or destructive operations.

## Inputs
Decision type, risk level, reviewer roles, evidence needed, SLA, escalation path, audit requirements, and possible outcomes.

## Context to inspect
Inspect current approval policy, reviewer workload, historical reversals, decision evidence, access controls, notification channels, and timeout behavior.

## Core knowledge
Human review is effective only when reviewers have context, authority, time, and clear criteria. High approval rates can signal good automation or meaningless review; measure disagreement and caught-error value rather than gate count.

## Procedure
1. Define why human intervention is required.
2. Specify what the automation may do before approval.
3. Present reviewers with relevant evidence, uncertainty, proposed action, and consequences.
4. Define approve, reject, request-change, escalate, and timeout outcomes.
5. Assign reviewers by role and least privilege.
6. Prevent the requester or automation from bypassing separation-of-duty controls.
7. Make approval actions idempotent.
8. Define expiry and revalidation if underlying data changes.
9. Record reviewer identity, evidence, decision, timestamp, and policy basis.
10. Monitor queue age, reversal rate, disagreement, and bottlenecks.
11. Periodically reassess whether the gate remains necessary.

## Decision points
Use mandatory approval for high-consequence irreversible actions. Use sampled review for lower-risk monitoring. Use exception-only review when deterministic validation provides strong coverage.

## Common failure patterns
Approval without evidence, stale approvals, reviewers with excessive privilege, endless pending states, and treating human review as a substitute for system validation.

## Verification
Test approval, rejection, timeout, reassignment, duplicate action, stale-data, and unauthorized-review scenarios.

## Expected output
A controlled review workflow with explicit criteria, roles, evidence, states, audit trail, and service targets.

## Stop conditions
Stop when no accountable reviewer exists, legal/policy authority is unclear, or reviewers cannot access enough evidence to make a meaningful decision.