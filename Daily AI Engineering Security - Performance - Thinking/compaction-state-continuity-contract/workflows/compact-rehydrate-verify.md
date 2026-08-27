# Workflow: Compact, Rehydrate, Verify

## Trigger
Automatic/manual compaction, token-budget rollover, replacement history creation, or persisted compacted-session resume.

## Goal
Reduce active context tokens while preserving durable operational state and continuation correctness.

## Inputs
Current history, active-context map, current epoch, token metrics, checkpoint policy, raw-tail candidates.

## Baseline
Measure pre-compaction rendered tokens, active-context keys/values, cache metrics when available, current task state, and repeated-work indicators.

## Context
Preserve active security/authorization constraints and complete recent tool groups. Treat summaries as lossy unless required fields are validated.

## Stages
1. **Observe** — capture the active-context map and token baseline.
2. **Measure** — classify context by lifetime/criticality and estimate removable tokens.
3. **Diagnose** — identify token-heavy static/repeated context and required durable state.
4. **Form hypothesis** — define the expected token reduction and continuity invariants.
5. **Build checkpoint** — use required schema fields and bounded content.
6. **Select raw tail** — retain complete recent turn/tool groups within budget.
7. **Rotate epoch** — assign a new context epoch to the replacement history.
8. **Rehydrate** — render durable active state exactly once into the new epoch; defer eligible low-priority context to retrieval.
9. **Measure again** — capture checkpoint, rehydration, raw-tail and total tokens.
10. **Validate** — run `scripts/checkpoint_guard.py`.
11. **Improved?** If no, rebuild once with a changed plan; if still invalid, fall back or stop. If yes, run independent verification.

## Responsible agent
Context-management implementation owns stages 1–10. `subagents/continuity-verifier.md` owns final verification.

## Tools
Token estimator/provider usage data, context renderer, checkpoint guard, schema validation, test runner, cache metrics where available.

## Outputs
Replacement context, checkpoint, epoch ID, continuity decision, token comparison, verification status.

## Checkpoints
Before history replacement; after checkpoint validation; after rehydration; before first subsequent model/tool step; before release.

## Metrics
Pre/post context tokens, active-context recall, compactions/10 turns, turns-to-next-compaction, repeated-work rate, cache reads/writes, task outcome.

## Retry policy
Maximum rebuild attempts: `config/budget.json`, default 1. A retry MUST address the reported missing-state or budget cause.

## Stop conditions
Missing critical active context; changed durable value without an authoritative state transition; invalid epoch; unpaired retained tool group; exhausted rebuild budget; failed independent verification.

## Failure path
Keep prior authoritative context when possible; otherwise use the platform's stable compaction fallback. Do not continue from a partially installed checkpoint.

## Verification
Run unit fixtures plus at least one representative long-task continuation comparison. Verify both token improvement and continuation fidelity.

## Definition of Done
Evidence documented; baseline captured; limitations identified; replacement implemented; token metrics collected; active-context recall complete; tests pass; before/after comparison complete; risks documented; verification complete; no blocking issue remains.
