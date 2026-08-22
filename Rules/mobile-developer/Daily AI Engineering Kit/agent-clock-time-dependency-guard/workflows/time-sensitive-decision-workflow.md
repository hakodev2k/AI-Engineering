# Workflow: Time-Sensitive Decision

## Trigger
A task depends on a deadline, TTL, expiry, schedule, maintenance window, cutoff, token/approval expiration, or current-time comparison.

## Entry conditions
Action/resource, decision type, risk, condition, and business timezone are explicit.

## Stages
1. **Context** — executor identifies condition semantics and dangerous-action boundaries.
2. **Capture** — Time Context Curator captures/validates a TimeObservation.
3. **Bind** — create TimeDecision binding observation, executor, risk, timezone, and condition.
4. **Evaluate** — run `scripts/evaluate-time-decision.py`.
5. **Refresh checkpoint** — if `revalidation-required`, refresh once and re-evaluate; preserve old evidence.
6. **Review** — high/critical risk goes to Time Safety Reviewer; review binds exact decision fingerprint.
7. **Approval checkpoint** — dangerous actions stop until explicit human approval exists.
8. **Final gate** — run `scripts/evaluate-final-gate.py` immediately before side effect.
9. **Execute** — only if gate is `verified` and evaluated condition is true.
10. **Record** — record execution and verification timestamps separately.

## Tools
Approved time/reference sources, Python stdlib scripts, repository evidence storage, protected execution tool only after gate.

## Produced artifacts
TimeObservation, TimeDecision, evaluation JSON, optional review JSON, execution evidence.

## Checkpoints
- Timezone resolved.
- Observation validated.
- Observation fresh enough for risk.
- High-risk review independent.
- Required human approval present.
- Final gate verified.

## Retry rules
Maximum 1 retry for transient time-source/read/tool failure. Preserve failed attempt evidence. Do not retry validation, permission, excessive-skew, approval, or business-rule failures.

## Failure paths
- Ambiguous timezone → `blocked`.
- Stale/untrusted observation → `revalidation-required`.
- High-risk missing reviewer → `review-required`.
- False time condition → stop without side effect.
- Missing dangerous-action approval → `blocked`.
- Repeated transient failure → `blocked` and escalate.

## Approval points
Production deployment, destructive operation, schema/data deletion, secret/config changes, irreversible migration, security weakening, and other dangerous actions require explicit human approval independent of this gate.

## Definition of Done
Current trusted time evidence exists; condition was evaluated against it; review/approval requirements are satisfied; final gate is `verified`; execution evidence records what happened; unresolved risk is documented; no blocking failure remains.
