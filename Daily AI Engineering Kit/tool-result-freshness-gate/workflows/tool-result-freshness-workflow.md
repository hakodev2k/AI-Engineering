# Workflow: Tool Result Freshness Gate

## Trigger
A task uses mutable tool results for planning, implementation, operational decisions, approvals or final verification.

## Entry conditions
- Task scope exists.
- Decision-relevant tool results are identifiable.
- `config/freshness-policy.json` is available.

## Inputs
Tool results, task decisions, current source metadata, invalidation events, human approvals when dangerous actions are involved.

## Context
Load only relevant result records, current state signals and source metadata. Expand context only when a freshness reason cannot be resolved.

## Stages
1. **Inventory results** — Workflow owner lists mutable results and downstream decisions.
2. **Capture records** — Freshness Curator applies `skills/capture-tool-result-freshness.md`.
3. **Evaluate freshness** — Run `scripts/evaluate-freshness.py` using current-state and invalidation inputs.
4. **Refresh stale evidence** — Apply `skills/revalidate-stale-evidence.md` only to affected results.
5. **Reconsider decisions** — If fingerprints changed, return affected decisions to planning before execution continues.
6. **Independent review** — Freshness Reviewer evaluates high-risk decision evidence.
7. **Final gate** — Run `scripts/evaluate-freshness-gate.py`.
8. **Proceed or stop** — Only `verified` permits the decision to claim fresh evidence; dangerous action still requires explicit human approval.

## Responsible agents
- Workflow owner: task scope and decision list.
- Freshness Curator: capture/refresh.
- Freshness Reviewer: independent review.

## Tools
Read-only source tools plus package scripts. Mutating tools are outside freshness validation and remain subject to their own approval boundary.

## Produced artifacts
- Freshness records.
- Current-state manifest.
- Invalidation-event list.
- Refresh reports.
- Reviewer record.
- Final gate report.

## Checkpoints
- Before implementation based on mutable external evidence.
- Before retry/resume after a material state change.
- Before dangerous action approval/execution.
- Before final verification.

## Retry rules
- Maximum transient refresh retries: 1 per result.
- Retryable: network timeout, rate-limit after safe delay, temporary read-service failure.
- Not retryable: revision changed, data changed, invalid schema, permission denial, business-rule conflict.
- Preserve first failure and prior evidence.
- After retry budget is exhausted, stop and escalate.

## Approval points
Explicit human approval is required before production deployment, destructive SQL, schema/data deletion, force push/history rewrite, infrastructure/secret/production-config changes, breaking API changes, weakened security controls, irreversible migration or large dependency upgrade. Fresh evidence is necessary but never substitutes for approval.

## Failure paths
- `refresh-required`: refresh only affected evidence.
- `blocked`: stop; report missing/invalid bindings or unresolved invalidation.
- Changed result: invalidate dependent conclusions and re-plan.
- Permission failure: stop without privilege escalation.
- Source unavailable: stop dependent high-risk action.

## Stop conditions
No infinite loop. Stop after one transient retry, unresolved stale evidence, changed evidence requiring re-planning, missing approval, or gate `blocked`.

## Definition of Done
- Every decision-relevant mutable result has a valid record.
- Current invalidation state was evaluated.
- Stale evidence was refreshed or explicitly blocked.
- Changed evidence was propagated to dependent decisions.
- High-risk review is independent.
- Final gate is `verified`.
- Required dangerous-action approvals are current and separate.
- Remaining risks are recorded.