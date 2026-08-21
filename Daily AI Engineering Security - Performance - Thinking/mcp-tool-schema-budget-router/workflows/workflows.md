# Workflows

## Workflow A — Measure → Route → Verify

### Trigger
Tool catalog exceeds budget, tool count grows materially, or cold-start context becomes expensive.

### Goal
Reduce model-visible tool-schema tokens without reducing essential tool reachability or task success.

### Inputs
Catalog, policy, representative tasks, optional provider token counter.

### Baseline
Run `schema_profiler.py` against the complete eager catalog and store total/per-tool estimated tokens.

### Context
Active model/client, MCP servers, current tool list, task classes, expected tools.

### Stages
1. **Observe** — collect catalog and cold-start metrics. Owner: Token Investigator.
2. **Baseline** — profile full definitions and flag dominant tools. Owner: Token Investigator.
3. **Hypothesis** — identify candidate selection and description-bloat opportunities. Owner: Routing Designer.
4. **Design** — define essential set, routing metadata, budget, fallback. Owner: Routing Designer.
5. **Implement** — place router before model-visible tool assembly. Owner: Implementation Agent.
6. **Measure again** — profile selected catalog per representative task. Owner: Verification Agent.
7. **Quality check** — calculate selection recall, call success, fallback rate, task regressions. Owner: Verification Agent.
8. **Decision** — enable only if all thresholds pass.

### Tools
`schema_profiler.py`, `tool_router.py`, test fixtures, provider token counter where available.

### Outputs
Baseline JSON, routed catalogs, routing reports, verification report.

### Checkpoints
- Baseline stored before edits.
- Essential set approved before routing.
- Schema-preservation check passes.
- Quality metrics pass before rollout.

### Metrics
Schema token reduction, selected tool count, selection recall, tool-call success, fallback rate, task regression rate.

### Retry policy
At most 2 routing-policy revisions per verification run. After 2 failures, stop and require redesign of metadata/budget/catalog.

### Stop conditions
- Success: all configured thresholds pass.
- Failure: essential tools exceed budget, recall remains below threshold after retries, or schema-preservation fails.

### Failure path
Rollback to prior bounded tool set; do not silently expose the complete catalog.

### Verification
Independent Verification Agent reviews fixtures and generated reports.

### Definition of Done
Baseline exists; selected set is within budget; schemas preserved; essential tools reachable; reduction/recall/call-success/fallback thresholds evaluated and passing.

---

## Workflow B — Catalog Change Gate

### Trigger
A tool is added, removed, renamed, re-described, or its input schema changes.

### Goal
Prevent fixed-context growth and routing drift from entering production unnoticed.

### Stages
1. Validate catalog structure and unique names.
2. Profile changed catalog.
3. Compare total and per-tool sizes with previous baseline.
4. Run representative routing fixtures.
5. Verify essential reachability.
6. Verify selected schema hashes match catalog source.
7. Block merge/release on policy violation.

### Retry policy
One corrected catalog/policy attempt in CI; subsequent failure requires owner review.

### Stop conditions
Pass all gates or block the change.

### Definition of Done
CI artifact contains before/after size, selected-tool diffs, and quality results.

---

## Workflow C — Deferred Discovery Failure Recovery

### Trigger
Tool search/deferred discovery is unavailable, returns zero tools unexpectedly, times out, or the model/client cannot access it.

### Goal
Keep essential functions reachable without expanding to the entire tool catalog.

### Stages
1. Detect failure using explicit runtime signal/timeout.
2. Increment fallback metric with reason.
3. Load all essential tools.
4. Add at most `fallbackAdditionalTools`, selecting smallest generally useful tools from routing metadata.
5. Re-run budget check.
6. If within budget, continue with `fallback=true` in telemetry.
7. If essential set exceeds budget, stop with actionable error.
8. After task, record missing expected tool if recovery was insufficient.

### Retry policy
No repeated discovery loop inside the same invocation; one fallback construction only.

### Stop conditions
Fallback catalog is valid and bounded, or hard failure is returned.

### Failure path
Human/platform owner must repair discovery/runtime compatibility or change the essential set.

### Verification
Synthetic discovery-failure fixture proves essential tools remain selectable.

### Definition of Done
No unbounded tool expansion and a deterministic reason-coded outcome exists.

---

## Workflow D — Safe Description Reduction

### Trigger
A selected tool individually exceeds `maxSingleToolTokens`.

### Goal
Reduce unnecessary prose while preserving tool-call semantics.

### Stages
1. Snapshot original definition/hash.
2. Identify duplicate behavioral prose versus schema-contract guidance.
3. Move long workflow guidance to a just-in-time skill/document.
4. Preserve names, property types, required fields, enums, constraints, and semantic descriptions needed for correct values.
5. Profile new definition.
6. Run argument-generation and runtime-validation fixtures.
7. Compare call success.

### Retry policy
At most 2 edits before abandoning the optimization.

### Stop conditions
Size target passes with no correctness regression, or original schema is restored.
