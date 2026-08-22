# Workflow — Measure, Optimize, Verify Context

## Trigger
High fixed context, unexpected token depletion, new MCP/plugin/skill additions, or prompt-budget regression.

## Goal
Reduce unnecessary context while preserving required behavior and security.

## Inputs
Baseline context inventory, budget threshold, representative task suite, required-fragment declarations.

## Baseline
Run `scripts/context_profiler.py` on the unchanged inventory and preserve the report.

## Stages
1. Inventory all exposed static/dynamic fragments.
2. Measure estimated tokens by source/kind.
3. Diagnose hotspots and exact duplicates.
4. Form a hypothesis: defer, deduplicate, compress, or keep.
5. Produce a candidate configuration without destructive automatic edits.
6. Measure candidate inventory with the identical estimator.
7. Compare savings and required-fragment preservation.
8. Run representative regression tasks.
9. Independent Context Budget Verifier reviews evidence.
10. Accept only when budget and quality gates pass.

## Checkpoints
Baseline immutable; mandatory fragments identified; estimator unchanged; candidate diff reviewed; regression evidence attached.

## Metrics
Fixed tokens, largest source share, duplicate ratio, savings percentage, task regression rate, startup/context latency where available.

## Retry policy
At most two optimization hypotheses per hotspot per run. If neither meets quality and savings gates, keep original context and record the result.

## Stop conditions
Stop on required-context loss, security-policy loss, incomplete inventory, inconsistent estimator, or regression beyond project threshold.

## Failure path
Restore/retain baseline configuration, record failed hypothesis, and escalate for host-specific investigation.

## Verification
Independent verifier recomputes reports and checks regression evidence.

## Definition of Done
Before/after measured; required fragments preserved; target savings reached or explicitly rejected; quality regression within threshold; verifier status `verified`.
