# Workflows

## Workflow A — Measure → Select → Verify

**Trigger:** catalog exceeds target schema budget, new MCP server is enabled, or token regression is detected.

**Goal:** reduce tool-definition context while preserving required-tool availability and task quality.

**Inputs:** complete tool catalog, representative task query, required tools, config, benchmark fixtures.

**Baseline:** full-catalog tool count and schema tokens; record model/context window and runtime version.

**Context:** only trusted task intent/routing metadata is used for selection. Full conversation history is not required by the deterministic baseline.

### Stages
1. **Observe — Catalog Profiler**
   - validate catalog;
   - run audit mode;
   - capture largest schemas and total footprint.
   - **Checkpoint:** baseline exists before optimization.
2. **Diagnose — Catalog Profiler**
   - determine whether cost comes from catalog size, several oversized schemas, or both;
   - identify tools explicitly required by workflow/policy.
3. **Hypothesize — Tool Selector Engineer**
   - define target/hard budget, max selected tools, lexical or semantic selector, confidence threshold;
   - state expected token reduction and expected recall.
4. **Implement — Tool Selector Engineer**
   - run selection with pinned/required tools;
   - integrate selected full schemas at model boundary;
   - retain compact host-side catalog for later promotion.
5. **Measure again — Verification Agent**
   - calculate selected tokens and reduction;
   - run benchmark fixtures;
   - calculate required-tool recall and quality regression.
6. **Decision**
   - if thresholds pass, proceed to final verification;
   - if recall fails, expand candidate budget once and rerun;
   - if still failing, tune retrieval once more or revert;
   - never exceed two tuning rounds without escalation.
7. **Verify — Verification Agent**
   - audit pinned tools, hard budget, fallback count, benchmark results, and measurement labels.

**Tools:** `scripts/tool_schema_budget.py`, `tests/test_tool_schema_budget.py`, provider tokenizer/tool search when available.

**Outputs:** baseline report, selected catalog, regression results, verification status.

**Metrics:** full/selected schema tokens, reduction %, recall@selected-set, false exclusion rate, task quality regression, selector p50/p95 latency when measured.

**Retry policy:** max 2 selector-tuning rounds. Deterministic script input/format errors are not retried; they are fixed.

**Stop conditions:** verified thresholds pass; hard budget conflict; required tool absent; or maximum tuning rounds exhausted.

**Failure path:** revert to last verified config. If full catalog itself exceeds hard context limits, escalate for catalog segmentation/provider-native tool search rather than injecting it blindly.

**Definition of Done:** baseline and post-change measured; required-tool recall threshold met; quality regression within tolerance; token reduction demonstrated; no pinned tool lost; bounded fallback tested; independent verification complete.

## Workflow B — Runtime Low-Confidence Fallback

**Trigger:** selector returns no candidate or confidence below configured threshold.

**Goal:** recover tool availability without unbounded catalog expansion.

**Inputs:** initial query, candidate scores, already selected tools, pinned tools.

**Baseline:** current selected count/tokens and failure reason.

### Stages
1. Record low-confidence state; do not pretend no tool is needed.
2. Expand candidate limit by `fallback_expand_by` while respecting hard budget.
3. Re-run selection with the same immutable required-tool set.
4. At most `max_fallback_rounds`, allow an orchestrator to refine explicit task intent or required tool names.
5. If still unresolved, stop and surface `tool-selection-blocked` to the host/human layer.

**Checkpoint:** every fallback records why it occurred and resulting token count.

**Retry policy:** strictly bounded by config; no recursive agent retries.

**Failure path:** no silent tool omission and no automatic hard-budget increase.

**Verification:** fixture must exercise zero-overlap query and prove blocked/fallback behavior.

**Definition of Done:** either a budget-compliant candidate set exists or the run stops with an explicit bounded failure.

## Workflow C — Schema Change Regression

**Trigger:** MCP server/tool name, description, or input schema changes.

**Goal:** ensure selector index/config and benchmarks remain valid.

**Stages:** fingerprint/export new catalog → invalidate old index/cache → rerun baseline → rerun benchmark → compare recall/tokens → approve or revert.

**Retry policy:** one regeneration retry for transient export failure; no retry for deterministic recall failure.

**Stop condition:** verification passes or schema change is blocked from rollout.
