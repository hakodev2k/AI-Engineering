# Autonomy and Approval Rules

## Purpose
Match AI autonomy to demonstrated reliability, reversibility, and impact.

## Scope
Covers autonomous planning, execution, delegation, persistence, and approval boundaries.

## MUST
- Define what the system may analyze, recommend, prepare, and execute independently.
- Require explicit human approval before irreversible, destructive, security-sensitive, high-cost, public, or production actions unless separately authorized by policy.
- Bound autonomous runs by time, cost, permissions, and reachable resources.
- Provide a reliable stop or revoke mechanism for persistent agents.

## MUST NOT
- Infer authority from user intent when explicit authorization is required.
- Expand privileges or approval scope autonomously.
- Hide material uncertainty from the approving human.

## SHOULD
- Increase autonomy only after measured reliability under representative conditions.
- Prefer reversible staged actions and previewable plans.

## Exceptions
Standing authorization must specify action classes, limits, expiry or review cadence, monitoring, and accountable owner.

## Verification
Inspect authorization policy, approval UX, run limits, permission tests, kill-switch exercises, and audit trails.
