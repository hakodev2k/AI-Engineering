# Production Execution and Approval Rules

## Purpose
Keep automation authority bounded and require human authorization for dangerous network actions.

## Scope
Production deployments, destructive operations, broad policy changes, credential changes, and execution modes.

## MUST
- Tooling MUST distinguish analyze, recommend, prepare, and execute capabilities.
- Production mutation MUST require authorization appropriate to blast radius and organizational policy.
- Destructive, irreversible, security-weakening, or broadly connectivity-affecting actions MUST require explicit human approval.
- Approved scope MUST bind targets, change intent, and material parameters; expanded scope requires reapproval.
- Emergency execution MUST be attributable to an authorized incident/change context.

## MUST NOT
- MUST NOT let an AI agent or unattended workflow silently promote itself from analysis/preparation to production execution.
- MUST NOT force push, rewrite protected history, bypass mandatory controls, or disable safety checks to expedite a network change.
- MUST NOT interpret absence of a rejection as approval.

## SHOULD
- High-risk workflows SHOULD use two-person review or equivalent separation of duties.
- Approval artifacts SHOULD include risk, rollback, and verification expectations.

## Exceptions
Only explicitly defined emergency authority may shorten normal approval, and it must remain bounded, logged, and retrospectively reviewed.

## Verification
Inspect RBAC, pipeline gates, approval records, target binding, emergency paths, audit logs, and negative tests proving unauthorized execution is rejected.