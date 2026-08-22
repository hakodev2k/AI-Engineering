# Incident Safety Rules

## MUST
- Preserve original evidence and timestamps before normalization or filtering.
- Reference evidence IDs for causal claims and major timeline statements.
- Distinguish observed fact, inference, hypothesis, mitigation, and verification.
- Record contradictory and missing evidence explicitly.
- Define expected mitigation effect and rollback path before any production mutation.
- Require explicit human approval for production deploys, rollbacks, config changes, database changes, secret changes, infrastructure changes, destructive operations, security-control changes, or mitigations with unknown blast radius.
- Verify recovery with measurable checks over a defined observation window.
- Keep the RCA cause `unconfirmed` when evidence is insufficient.

## MUST NOT
- Invent timestamps, log entries, metrics, traces, deploy events, or operator actions.
- Treat temporal correlation as proof of causation.
- Modify production merely to test a hypothesis without explicit approval.
- Disable monitoring, validation, authentication, authorization, rate limiting, or other safety controls to make symptoms disappear.
- Delete evidence or hide contradictory observations.
- Auto-retry a production mutation unless an approved runbook explicitly declares it idempotent and provides retry limits.
- Declare an incident verified solely because symptoms decreased after a mitigation.
- Force-push or rewrite shared Git history during incident response without explicit approval.

## SHOULD
- Prefer read-only evidence collection and safe-environment reproduction.
- Test hypotheses with discriminating evidence that separates alternatives.
- Keep active hypotheses to five or fewer.
- Capture deploy/config/dependency events around the incident window even when they appear unrelated.
- Prefer the smallest reversible mitigation that reduces user impact.
- Separate immediate mitigation notes from the later verified RCA.
- Preserve uncertainty rather than filling gaps with plausible narrative.
