# Workflows

## Workflow 1 — Oversized Tool Output Handling

### Trigger
A tool returns output before it is appended to model context.

### Goal
Keep the model-visible payload within budget while preserving full recoverable evidence.

### Inputs
Raw tool output, tool metadata, active context state, policy.

### Baseline
Capture raw bytes, raw lines, approximate/model-measured tokens when available, current context utilization.

### Stages
1. **Measure** — Context Pressure Analyst records raw size.
2. **Classify** — determine text/JSON/binary and whether full raw output may matter later.
3. **Budget decision** — if within budget, pass through; otherwise spill.
4. **Spill** — persist full raw payload under approved root and compute SHA-256.
5. **Extract** — preserve head/tail and bounded priority evidence with source line numbers.
6. **Envelope** — emit compact model-visible JSON/text containing extraction, counts, omissions, path/reference, hash, and `spilled=true`.
7. **Verify** — independently recompute hash and check model-visible budget.
8. **Continue** — append only verified bounded envelope to model context.

### Responsible agents
Context Pressure Analyst → Spillover Implementation Agent → Independent Verification Agent.

### Tools
`scripts/tool_output_guard.py`, runtime token estimator, artifact store.

### Outputs
Bounded model-visible payload + durable raw artifact + metrics event.

### Checkpoints
- raw measurement completed;
- spill artifact hash verified;
- envelope reports omissions explicitly;
- visible payload under budget.

### Metrics
raw/visible tokens and bytes, reduction ratio, spill latency, spill failure rate.

### Retry policy
One artifact-write retry. Extraction may be recalculated once with a stricter limit. No unbounded retries.

### Stop conditions
Stop with success after verified envelope creation; stop with failure if storage/integrity cannot be established for an oversized payload.

### Failure path
Do not forward oversized raw output. Return structured `tool-output-guard-failed` state and escalate to runtime owner.

### Verification
Hash match + budget check + sample line provenance.

### Definition of Done
Full output recoverable, visible output bounded, omissions explicit, integrity verified.

---

## Workflow 2 — Targeted Rehydration

### Trigger
Planner/verifier needs evidence omitted from the current envelope.

### Goal
Recover only the needed evidence without loading the entire artifact.

### Inputs
Artifact reference/hash and either line range or search term.

### Baseline
Record requested scope and current model-context budget.

### Stages
1. Verify path is under approved spill root.
2. Verify SHA-256.
3. Resolve bounded line range or search matches.
4. Return at most configured lines/bytes with source numbers.
5. Record rehydrate metrics.
6. Decide whether evidence is sufficient.

### Checkpoints
Hash verified before read; excerpt bounds enforced.

### Metrics
rehydrate bytes/tokens, calls/task, requested-to-returned ratio, full-artifact fallback count.

### Retry policy
At most two targeted rehydrate requests for the same unresolved question before human/runtime escalation or an explicit larger-budget decision.

### Stop conditions
Required evidence found; search exhausted; integrity error; retry limit reached.

### Failure path
Hash mismatch/path escape fails closed. Missing artifact requires regeneration or original tool rerun only if safe/necessary.

### Verification
Returned lines match raw artifact line positions.

### Definition of Done
Requested evidence is recovered with verified provenance and bounded context impact.

---

## Workflow 3 — Production Budget Tuning

### Trigger
After enough production traces exist or after a context/token regression.

### Goal
Tune output budgets using measurements rather than arbitrary truncation.

### Inputs
Per-tool raw/visible token distributions, spill rates, rehydrate rates, quality/evaluation results, latency.

### Stages
1. Capture p50/p95 raw and visible sizes per tool.
2. Identify high spill + high rehydrate tools.
3. Form one tuning hypothesis: budget, extraction pattern, or structured projection.
4. Apply to replay/evaluation corpus.
5. Measure token/cost/latency and task quality.
6. Accept only if savings are measurable and quality/security thresholds remain satisfied.

### Retry policy
Maximum three tuning experiments per tool per review cycle.

### Stop conditions
Target achieved; no measurable improvement; quality regression; three hypotheses exhausted.

### Verification
Comparison report includes baseline and post-change values.

### Definition of Done
Budget is evidence-based and no required-context regression is detected.