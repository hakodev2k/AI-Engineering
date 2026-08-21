# Tool Schema Lazy Context Budgeter

## Category
Token

## Problem
Tool-heavy agents can spend most of each request's input budget on JSON Schema for tools that are never used. This raises cost/latency and reduces effective context available for task reasoning.

## Evidence
See `evidence/research.md`. Current signals include MCP issue #2808/#2812 and July 2026 Hermes Agent reports measuring roughly 14K–27K tool-schema tokens/request in large tool configurations, including one reported case where schemas represented 83.1% of request tokens.

## Existing approach and limitations
Manual tool disabling, prompt caching, schema trimming, and all-tools mode each help in some cases. Manual filtering predicts needs poorly; caching does not reclaim context-window occupancy; trimming cannot eliminate nested-schema cost; always loading all tools preserves recall but wastes context. Lazy loading can itself regress tool recall or add round trips if used blindly.

## Proposed improvement
Measure first, then activate lazy/tiered schema loading only above validated thresholds. Keep compact tool descriptors for discovery, pin core/safety-critical tools, load bounded relevant full schemas, and verify against a frozen benchmark. Fall back to all-tools/static toolsets when quality gates fail.

## Architecture
- `evidence/research.md` — current evidence, limitations, root causes, metrics.
- `config/budget.json` — activation thresholds, schema budget, quality gates.
- `scripts/select_tool_schemas.py` — deterministic schema-cost estimator and bounded selector.
- `skills/tool-context-budget-analysis.md` — baseline/optimization skill.
- `rules/context-budget.md` — enforceable token and correctness rules.
- `subagents/context-benchmark-verifier.md` — independent before/after verifier.
- `workflows/measure-select-verify.md` — bounded optimization workflow.
- `hooks/pre-request-budget-gate.md` — deterministic request-construction gate.

## Installation
Python 3.10+; standard library only. Production deployments SHOULD replace the script's deterministic `chars/4` estimate with provider/tokenizer measurements for authoritative accounting, while retaining the selector's budget logic.

## Configuration
Edit `config/budget.json`. Set `core_tools` to tools that must always remain available. Thresholds are defaults, not universal constants. Validate them on your workload before rollout.

## Usage
Prepare `request-tools.json` with `task`, full `tools` definitions, and optional `recent_tools`, then run:

`python scripts/select_tool_schemas.py request-tools.json --config config/budget.json`

The output reports estimated all-schema tokens, selected-schema tokens, estimated savings, selected tool names, reasons, and a compact catalog.

## Workflow
Follow `workflows/measure-select-verify.md`: Measure → Diagnose → Hypothesize → Select → Measure again → bounded tune/revert → independent verification.

## Metrics
Schema tokens/request, schema share of total input, total tokens/task, cost/task, latency, selected-tool recall/precision, extra selection round trips, task success/regression, prompt-cache hit rate.

## Verification
### Implemented
Threshold-based activation, deterministic schema measurement, compact descriptor generation, core-tool pinning, task/recent-use scoring, max-tool/max-token budgets, and safe failure when required core schemas cannot fit.

### Measured
Run identical representative tasks in all-tools and lazy modes. Use provider token counts when available; record estimator error separately. Record required/used tool set, latency, cost, and task result.

### Verified
Optimization is verified only when schema/total tokens or latency materially improve, selected-tool recall is at least `min_selected_tool_recall`, task-success regression does not exceed `max_task_success_regression`, core tools remain available, and fallback behavior is tested.

## Safety and correctness
Never remove required context solely to save tokens. Full schema must be loaded before invocation. Safety-critical/core tools remain pinned. Unknown/low-confidence selection should expand or fall back rather than fabricate parameters.

## Failure handling
Invalid selector input/config or a core-tool budget violation blocks optimized request construction and uses safe all-tools/static-toolset fallback. Tuning is limited to two iterations. Registry changes invalidate prior measurements/caches.

## Definition of Done
Baseline captured; schema attribution measured; lazy selection implemented; before/after benchmark complete; quality gates pass; core tools preserved; extra round trips accounted for; independent verifier approves; fallback tested; no critical context loss observed.

## Customization
Replace keyword scoring with embedding/classifier retrieval, provider-native tool search, or historical routing while keeping the same budget and regression gates. Add provider-specific cache telemetry and exact token counting without weakening correctness thresholds.