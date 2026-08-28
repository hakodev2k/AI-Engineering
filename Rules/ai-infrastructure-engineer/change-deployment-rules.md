# Change and Deployment Rules

## Purpose
Control production infrastructure changes that can affect expensive or business-critical AI workloads.

## Scope
Applies to cluster, network, storage, runtime, scheduler, serving, quota, and infrastructure configuration changes.

## MUST
- Production changes MUST define scope, expected impact, validation, rollback, and owner.
- High-risk changes MUST use staged rollout or equivalent blast-radius control.
- Active long-running workloads MUST be considered before disruptive changes.
- Breaking infrastructure contracts or security controls MUST require human approval.

## MUST NOT
- MUST NOT perform fleet-wide disruptive changes without prior staged evidence.
- MUST NOT force-push or rewrite shared infrastructure history to bypass review.
- MUST NOT execute destructive infrastructure changes without explicit authorization.

## SHOULD
- Changes SHOULD be small and reversible.
- Deployment windows SHOULD account for workload cost and recovery time, not only service traffic.

## Exceptions
Exceptions require urgency, risk evidence, mitigation, rollback feasibility, and accountable approval.

## Verification
Review change records, diffs, approvals, staged rollout metrics, workload inventory, rollback tests, and post-change validation.