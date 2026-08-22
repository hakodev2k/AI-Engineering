# Core Skills

## Skill 1 — Baseline Tool-Schema Footprint

**Purpose:** establish the token cost of the complete tool catalog before optimization.

**Trigger:** new MCP server, agent runtime change, model/context-window change, or token regression.

**Inputs:** normalized tool catalog JSON, `config/tool-budget.json`.

**Preconditions:** catalog is captured without secrets; tool names are stable enough to compare runs.

**Required context:** model/context limit, current enabled servers, representative task mix.

**Tools:** `scripts/tool_schema_budget.py`, provider tokenizer when available.

**Procedure:**
1. Export the host-visible tool catalog.
2. Run `python scripts/tool_schema_budget.py catalog.json --mode audit`.
3. Record total tools, estimated schema tokens, and largest schemas.
4. If exact tokenizer usage is available, replace/augment the estimator and retain both numbers.
5. Calculate schema utilization = schema tokens / usable model input budget.
6. Save the baseline with runtime/model/version metadata.

**Decisions:** over-budget catalogs enter selective-loading workflow; under-budget catalogs remain observable but need no optimization.

**Constraints:** do not optimize before baseline; do not claim provider billing savings from an estimate alone.

**Expected output:** reproducible baseline report.

**Metrics:** estimated/exact schema tokens, tool count, tokens/tool, context utilization.

**Verification:** rerun against identical catalog; variance must be zero for estimator-based measurements.

**Failure handling:** malformed catalogs block measurement; fix export/normalization rather than guessing.

**Stop conditions:** baseline captured or input cannot be validated.

## Skill 2 — Budgeted Tool Promotion

**Purpose:** load only schemas relevant to the task while preserving required tools.

**Trigger:** baseline exceeds configured target or tool catalog is large enough to threaten context budget.

**Inputs:** task query/intent, catalog, pinned/required tools, budget policy.

**Preconditions:** required tools can be explicitly named; a fallback route exists.

**Required context:** task text plus trusted routing metadata; do not feed unrelated conversation history into retrieval by default.

**Tools:** selection mode of `tool_schema_budget.py`; optional embedding/tool-search replacement.

**Procedure:**
1. Pin tools explicitly required by workflow, policy, or user instruction.
2. Retrieve candidate tools from current task intent.
3. Promote pinned tools first, then candidates until target budget/max count.
4. Reject any selection exceeding hard budget unless human/policy explicitly raises the budget.
5. If no candidate clears confidence threshold, use bounded fallback expansion or request the orchestrator to provide an explicit tool requirement.
6. Pass only selected full schemas to the model.
7. Record selected/total counts and token delta.

**Decisions:** low confidence expands candidate set at most `max_fallback_rounds`; hard-budget conflict stops rather than silently dropping pinned tools.

**Constraints:** never silently exclude an explicit required tool; never infer success from lower token count alone.

**Expected output:** selected catalog plus selection report.

**Metrics:** selected tokens, reduction %, selected/total ratio, selection latency.

**Verification:** required tool recall = 100%; representative benchmark recall meets threshold.

**Failure handling:** fallback to a larger bounded set; final fallback may load full catalog only if it fits hard model/context constraints.

**Stop conditions:** valid selection produced, bounded fallback exhausted, or hard budget conflict requires escalation.

## Skill 3 — Selection Quality Regression

**Purpose:** prove token savings do not break tool availability or task quality.

**Trigger:** selector/config/schema changes.

**Inputs:** benchmark cases containing query plus expected required tool(s), baseline results, post-change results.

**Preconditions:** benchmark includes common, ambiguous, and rare-tool tasks.

**Tools:** selector, test harness, task evaluator where available.

**Procedure:**
1. Run each benchmark against full catalog as reference.
2. Run budgeted selection.
3. Measure required-tool recall@selected-set.
4. Compare task success or deterministic tool-availability assertions.
5. Calculate token reduction and regression rate.
6. Reject change if recall or quality threshold fails.

**Decisions:** optimize top-k/threshold only inside bounded experiment rounds; never lower quality threshold merely to pass.

**Constraints:** separate retrieval quality from model task quality.

**Expected output:** before/after table with Implemented, Measured, Verified status.

**Metrics:** recall, false exclusion rate, quality regression rate, tokens/task, selector latency.

**Verification:** independent Verification Agent reviews benchmark and thresholds.

**Failure handling:** revert selector/config or expand candidate budget.

**Stop conditions:** thresholds pass or maximum two tuning rounds fail and escalation is required.
