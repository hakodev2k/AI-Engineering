# Workflow: Preflight and Reduce

## Trigger
Every model call; detailed reduction path activates when utilization exceeds the usable input budget.

## Goal
Fit the exact request within the model window while preserving correctness-critical context.

## Inputs
Final context component counts, model context window, output reserve, safety margin, component criticality/reloadability.

## Baseline
Capture the unreduced component totals, model-call latency where available, tokens/task, and task-quality result.

## Context
Reduction order should prefer deterministic duplication removal and reloadable low-priority material before lossy summaries.

## Stages
1. **Observe** — list every context component.
2. **Measure baseline** — run `context_budget.py` on unreduced counts.
3. **Diagnose** — identify top token consumers and duplicate/reloadable sources.
4. **Form hypothesis** — specify one reducer and expected token savings.
5. **Implement improvement** — apply one reducer.
6. **Measure again** — recount exact payload.
7. **Improved?** — if no, permit at most one additional reduction cycle.
8. **Verify** — independent Context Verifier checks protected content and representative task result.

## Responsible agent
Runtime/implementation agent reduces; `context-verifier` independently verifies.

## Tools
Provider tokenizer, prompt serializer, `scripts/context_budget.py`, regression suite.

## Outputs
Before/after budget reports, reducer applied, quality result, final decision.

## Checkpoints
After each cycle confirm protected kinds unchanged and output reserve intact.

## Metrics
Input tokens/task, utilization, overflow rate, latency/cost when provider metrics exist, regression rate.

## Retry policy
Maximum 2 reduction cycles by default. Each cycle must change the payload or hypothesis; identical retries are forbidden.

## Stop conditions
Fits safely; no safe candidates; protected-only content already exceeds budget; maximum cycles reached.

## Failure path
Do not send oversized request. Split task, create verified continuation checkpoint, switch to an explicitly configured larger-context model, or escalate.

## Verification
Replay representative fixtures and compare acceptance criteria/evidence coverage.

## Definition of Done
Exact final payload fits; reserve/margin preserved; before/after measured; protected context unchanged; regression checks pass; verifier signs off.