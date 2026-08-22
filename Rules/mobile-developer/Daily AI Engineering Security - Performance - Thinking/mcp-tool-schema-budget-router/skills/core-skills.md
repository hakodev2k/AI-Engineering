# Core Skills

## Skill 1 — Profile Tool Schema Cost

### Purpose
Measure the fixed model-visible footprint of a tool catalog before attempting optimization.

### Trigger
Use when an agent/MCP client registers more than a few tools, cold-start context is large, or tool catalogs change frequently.

### Inputs
- Tool catalog JSON.
- Active policy.
- Optional provider token counter for calibration.

### Preconditions
- Every tool has a stable name.
- Full original schemas are available.

### Required context
Tool name, description, input schema, optional tags/server identity.

### Tools
`scripts/schema_profiler.py`

### Procedure
1. Validate catalog structure and unique names.
2. Serialize each model-visible tool definition deterministically.
3. Estimate tokens using configured chars/token.
4. Rank tools by estimated schema cost.
5. Calculate total and percent-of-budget.
6. Flag individual tools exceeding `maxSingleToolTokens`.
7. Save baseline metrics before any schema or routing change.
8. If provider token-count API is available, calibrate the approximation on a sample and record the error.

### Decisions
- If total <= budget and catalog is stable, optimization is optional.
- If total > budget, route/select before model exposure.
- If one tool dominates, simplify documentation separately from schema semantics.

### Constraints
Never mutate the source schema during profiling.

### Expected output
JSON report containing total size, estimated tokens, per-tool size, budget status, and largest contributors.

### Metrics
Total estimated tokens, max single-tool tokens, catalog count, budget utilization.

### Verification
Re-run profiler against unchanged input; results must be deterministic except timestamps.

### Failure handling
Invalid schema/catalog exits non-zero and blocks routing.

### Stop conditions
Stop when baseline is saved and all catalog entries are accounted for.

---

## Skill 2 — Build a Budgeted Candidate Set

### Purpose
Expose only task-relevant full tool schemas while preserving essential reachability.

### Trigger
Baseline exceeds the tool-schema budget or policy requires selective exposure.

### Inputs
- User/task text.
- Catalog with compact `routing` metadata.
- Budget policy.

### Preconditions
Each tool must keep an immutable original callable definition plus compact routing metadata such as tags/keywords.

### Required context
Task text, tool names, tags, short routing descriptions, essential designation, estimated schema cost.

### Tools
`scripts/tool_router.py`

### Procedure
1. Normalize task terms.
2. Always seed the candidate set with essential tools.
3. Score nonessential tools using deterministic name/tag/keyword overlap.
4. Sort by score descending, then schema size ascending, then name.
5. Add tools until token/count budget would be exceeded.
6. Never partially truncate a JSON Schema to make it fit.
7. If no relevant tool scores, use the bounded fallback policy.
8. Emit selected and rejected tools with reason codes.

### Decisions
- Prefer a smaller high-relevance set over many weak matches.
- If a required tool cannot fit, escalate budget/policy rather than silently dropping constraints.
- If discovery support is known broken, use local deterministic routing directly.

### Constraints
Tool selection may filter tools but must not alter selected input schemas.

### Expected output
Selected catalog containing original schemas plus a routing decision report.

### Metrics
Selected count, selected tokens, reduction ratio, fallback activation.

### Verification
Compare selected tool names against a labeled representative task set.

### Failure handling
If essential tools alone exceed budget, return a hard failure requiring catalog redesign or budget increase.

### Stop conditions
Stop when selected set is within both count and token budgets.

---

## Skill 3 — Validate Quality Before Enabling Routing

### Purpose
Ensure token reduction does not reduce tool availability or task correctness.

### Trigger
Before enabling routing in production and after catalog/policy changes.

### Inputs
Representative tasks with expected tool sets, before/after metrics, call results.

### Procedure
1. Freeze a baseline eager catalog.
2. Run labeled tasks through the router.
3. Measure selection recall: expected tools selected / expected tools.
4. Execute non-destructive integration calls where possible.
5. Compare tool-call success and task outcome.
6. Measure schema-token reduction.
7. Measure fallback rate.
8. Fail rollout if any regression threshold is violated.

### Metrics
Selection recall, call success, reduction ratio, fallback rate, task regression rate.

### Verification
An independent verification agent checks the report and input fixtures.

### Failure handling
Rollback to the previous policy or bounded eager subset; do not expose the full catalog automatically unless policy explicitly allows it.

### Stop conditions
All configured regression thresholds pass.

---

## Skill 4 — Reduce Schema Bloat Safely

### Purpose
Reduce description overhead without weakening callable contracts.

### Trigger
A few tools dominate context after selective routing is already applied.

### Procedure
1. Separate parameter-contract descriptions from behavioral workflow guidance.
2. Move long operational procedures into skills/docs loaded only when needed.
3. Keep field descriptions that disambiguate values, units, formats, safety semantics, or mutually exclusive choices.
4. Remove duplicated prose and examples only after tests exist.
5. Do not remove enum constraints, required fields, ranges, object shapes, or `$ref` semantics merely to save tokens.
6. Re-profile.
7. Run call-generation fixtures and runtime validation.

### Expected output
A reviewed schema change with before/after token estimate and correctness evidence.

### Stop conditions
Target reduction is reached or further reduction would risk semantic ambiguity.
