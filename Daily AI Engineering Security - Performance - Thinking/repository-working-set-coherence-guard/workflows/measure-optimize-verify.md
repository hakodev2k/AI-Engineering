# Workflow: Measure → Optimize → Verify

## Trigger
Repository-scale coding task or context refresh.

## Goal
Reduce context/token waste without losing facts required for a correct, verifiable edit.

## Inputs
Task, planned edits, acceptance criteria, context inventory, repository state, policy.

## Baseline
Record context bytes/tokens, duplicate ratio, repository read/search count, required-fact coverage, task/test baseline.

## Stages
1. **Observe** — Context Curator records current context and edit dependencies.
2. **Measure** — run `scripts/working_set_guard.py` against the manifest and policy.
3. **Diagnose** — classify excess context as duplicate, stale, supporting, or required; identify missing coupled facts.
4. **Hypothesize** — propose one bounded change: deduplicate, replace raw exploration with source references, fetch a missing fact, or split the edit.
5. **Optimize** — apply only context-management changes; no source-code edit yet if guard blocks.
6. **Measure again** — recompute coverage, freshness, duplication, and size.
7. **Implement** — proceed only on `allow`.
8. **Verify** — run mapped tests/static checks; compare task quality and regression evidence with baseline.

## Responsible agents
Context Curator: stages 1–6. Implementation Agent: stage 7. Independent Verification Agent: stage 8.

## Tools
Repository reads/search, hash calculation, `working_set_guard.py`, test/build/static-analysis commands.

## Outputs
Before/after metrics, final manifest, guard decision, implementation evidence, verification result.

## Checkpoints
- Required coverage before edit.
- Freshness after repository changes.
- Token/context comparison after optimization.
- Test/regression evidence before completion.

## Metrics
Context bytes/tokens, duplicate ratio, required-fact coverage, repeated reads, tests passed, regression rate.

## Retry policy
At most `max_refresh_retries` context-refresh attempts. Each retry must address a named missing/stale fact.

## Stop conditions
Stop successfully when guard allows and verification passes. Stop unsuccessfully when retry budget is exhausted or quality regresses beyond policy.

## Failure path
Preserve evidence and manifest, report unresolved facts or regression, and do not weaken the coverage threshold.

## Definition of Done
Implemented: guard and manifest used. Measured: before/after context metrics captured. Verified: required coverage maintained, tests pass, and no quality regression is observed.