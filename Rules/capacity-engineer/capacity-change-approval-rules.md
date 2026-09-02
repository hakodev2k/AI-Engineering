# Capacity Change Approval

## Purpose
Control high-risk capacity changes that can affect production safety, cost, resilience, or public service behavior.

## Scope
Applies to production scaling limits, resource reductions, quota changes, topology changes, major reservations, throttling, and capacity-related configuration.

## MUST
- Production capacity changes MUST distinguish analysis, recommendation, preparation, and execution authority.
- Changes that reduce resilience margin, alter failover capacity, or materially change hard limits MUST receive human approval before execution.
- Every high-risk change MUST define expected effect, evidence, rollback conditions, monitoring, and accountable owner.
- Emergency capacity changes MUST be recorded and reviewed after stabilization.

## MUST NOT
- MUST NOT reduce protected capacity, delete production resources, or weaken protective limits without explicit approval.
- MUST NOT force-push, rewrite history, or bypass required change controls to accelerate a capacity change.
- MUST NOT claim a change is safe solely because it is reversible in theory; rollback feasibility MUST be validated where material.

## SHOULD
- Prefer incremental and observable changes over large one-step adjustments.
- Use progressive rollout when capacity behavior can be validated safely at partial exposure.

## Exceptions
Exceptions require documented urgency, risk, compensating controls, approval, and retrospective verification.

## Verification
Inspect change records, approvals, diffs, deployment logs, monitoring, rollback evidence, and post-change capacity metrics.
