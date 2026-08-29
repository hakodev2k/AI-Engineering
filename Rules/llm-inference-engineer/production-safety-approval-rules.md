# Production Safety and Approval Rules

## Purpose
Define authority boundaries for risky inference actions and prevent an operator or AI agent from silently exceeding its mandate.

## Scope
Applies to production deployment, fleet changes, traffic routing, model replacement, destructive actions, security changes, credential operations, and breaking contracts.

## MUST
- Actions MUST be distinguished as analyze, recommend, prepare, or execute.
- Production deployment, destructive infrastructure actions, secret rotation, security-control weakening, breaking public contracts, large traffic shifts, and irreversible changes MUST require authorized human approval unless an explicitly approved automation policy already governs the action.
- Before a high-risk action, the operator MUST document scope, expected effect, blast radius, rollback or recovery path, and verification criteria.
- Production configuration changes MUST be traceable to an authorized change record or equivalent audit evidence.
- Emergency execution MUST minimize scope and preserve evidence for later review.
- Rollback readiness MUST be confirmed before changes that can materially affect availability or correctness.

## MUST NOT
- MUST NOT force push, rewrite shared Git history, destroy infrastructure, delete production data, rotate secrets, or disable security controls without explicit authorization.
- MUST NOT expand from investigation into execution merely because the proposed action appears safe.
- MUST NOT bypass change controls to avoid waiting for review.
- MUST NOT execute an irreversible change when a reversible alternative can achieve the immediate objective with acceptable risk unless explicitly approved.

## SHOULD
- High-risk changes SHOULD use two-person review or separation of duties where the operating environment supports it.
- Changes SHOULD be decomposed into reversible stages with observable checkpoints.

## Exceptions
Emergency exceptions require incident context, named authority, explicit risk acceptance, bounded scope, and retrospective verification.

## Verification
Inspect deployment and audit logs, approval records, change tickets, rollback evidence, Git history, configuration diffs, and incident records. Confirm execution authority matched the action performed.