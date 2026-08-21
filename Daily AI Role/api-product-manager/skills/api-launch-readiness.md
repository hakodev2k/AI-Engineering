# Skill: API Launch Readiness

**Trigger:** capability is approaching beta/GA or external/internal rollout.

## Procedure
Check contract stability, implementation/test evidence, reliability objectives, auth/security, quotas, analytics, documentation, examples, SDK/tooling impact, support ownership, incident route, changelog, migration implications, rollout controls, consumer communication, and success metrics.

Run specialist reviews in parallel after the release candidate contract is stable. Consolidate blockers into one readiness decision.

## Decision
Recommend GO only when blocking criteria have evidence. Recommend CONDITIONAL GO only with named owner, mitigation, expiry, and approved risk. Recommend NO-GO for unresolved breaking/security/reliability/ownership blockers.

## Output
Launch readiness record, blockers, approvals, rollout/monitoring plan, rollback/mitigation, communication, post-launch checkpoints.

## Stop conditions
No silent override of required human approvals or production policy.