# Integration Guide

## Integration point
Place the gate between tool discovery/registration and model request construction. The host may know all tools, but only promoted full schemas should enter the model request.

## 1. Export the host-visible catalog
Normalize tools to `{"tools":[{"name":"...","description":"...","inputSchema":{}}]}`. Do not include credentials or runtime secrets in descriptions/examples.

## 2. Capture baseline
Run `python scripts/tool_schema_budget.py catalog.json --mode audit` and store the result with model/runtime/catalog version. Treat the built-in estimator as comparative unless replaced with the provider tokenizer.

## 3. Configure policy
Edit `config/tool-budget.json`: hard ceiling, preferred target, max selected tools, retrieval threshold, pinned tools, and bounded fallback. Choose values from the actual context window/workload baseline; do not copy defaults blindly into production.

## 4. Promote schemas per task
Example:
`python scripts/tool_schema_budget.py catalog.json --mode select --query "search GitHub issues for an MCP regression" --required github_search_issues --output selected-tools.json`

The orchestrator sends the selected schemas to the model. Required tools are pinned before relevance selection.

## 5. Replace lexical retrieval when useful
The shipped selector is dependency-free and deterministic. Production hosts may replace `lexical_score` with provider-native tool search/deferred loading, embeddings/vector retrieval, learned routing, or hybrid retrieval. Preserve the contract: explicit pins first, hard budget, observable scores, bounded fallback, regression benchmark.

## 6. Handle dynamic MCP changes
On `tools/list_changed`, reconnect, or schema fingerprint change: export new catalog → invalidate cached selector/index → rerun baseline → rerun benchmark → mark the new catalog verified only after thresholds pass.

## 7. Validate
Run `python -m unittest tests/test_tool_schema_budget.py`. Add repository-specific benchmark fixtures with `{query, required_tools}` and end-to-end expected outcomes where possible.

## 8. Rollout
Start observe-only: compute what would be promoted while retaining current behavior. Compare misses and savings. Then enable selective promotion for a small workload slice before broad rollout.

## Safety and correctness boundaries
- Never drop explicit required tools to hit a token target.
- Never strip parameter validation or destructive-action warnings solely for savings.
- Never recurse indefinitely when retrieval is uncertain.
- If the full catalog cannot fit and selection cannot reach required recall, stop/escalate rather than silently proceeding without tools.

## Metrics
Export `catalog_tools`, `catalog_schema_tokens`, `selected_tools`, `selected_schema_tokens`, `schema_token_reduction_ratio`, `required_tool_recall`, `selector_latency_ms`, `fallback_round`, `selection_blocked`, and task-quality regression when available.
