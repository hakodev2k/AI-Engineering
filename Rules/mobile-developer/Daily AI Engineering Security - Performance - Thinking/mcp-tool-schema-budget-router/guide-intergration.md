# Integration Guide — MCP Tool Schema Budget Router

## Integration boundary
Place the router between **tool discovery/catalog assembly** and **model invocation**:

```text
MCP servers / local tools
        ↓
Full validated catalog
        ↓
Schema profiler + cached size metadata
        ↓
Task-aware budget router
        ↓
Bounded full-schema subset
        ↓
Model request tools[]
        ↓
Tool dispatcher → original runtime implementation
```

The router decides which tools become model-visible. It does not alter authorization, execute tools, or weaken runtime argument validation.

## 1. Prepare catalog metadata
Keep each original callable definition intact and attach host-only routing metadata:

```json
{
  "name": "database_query",
  "description": "Run a read-only SQL query against an approved database connection.",
  "inputSchema": { "type": "object", "properties": {} },
  "routing": {
    "tags": ["database", "sql"],
    "keywords": ["database", "sql", "query", "table"],
    "summary": "Query structured database data."
  }
}
```

`routing` is never required by MCP. It is internal metadata used before constructing the model-visible tool array. The provided scripts exclude it from schema-token estimates and selected model-visible definitions.

### Routing metadata rules
- Keep tags stable and capability-oriented.
- Keep keywords small; do not paste full tool documentation into routing metadata.
- Use `essential` only for tools that must remain directly reachable for most tasks or for recovery.
- Never put credentials, tenant data, user data, or secrets in routing metadata.

## 2. Establish baseline

```bash
python scripts/schema_profiler.py examples/tool-catalog.sample.json \
  --policy config/tool-budget-policy.json
```

For a real host, export its discovered tool catalog to JSON and profile that file. Persist:
- total tool count;
- total estimated schema tokens;
- largest tool schemas;
- definition SHA-256 values;
- current catalog/version/commit.

The package uses a deterministic chars/token approximation for portability. If your provider exposes an authoritative token counter, calibrate the estimate and record the observed error. Do not present the approximation as provider-billed tokens.

## 3. Select tools for a task

```bash
printf '%s' 'Find the service that writes orders to PostgreSQL' > task.txt
python scripts/tool_router.py \
  --catalog examples/tool-catalog.sample.json \
  --task-file task.txt \
  --policy config/tool-budget-policy.json \
  --output selected-tools.json \
  --report routing-report.json
```

Use `selected-tools.json` as the model-visible tool list after adapting field names to your provider/client.

## 4. Integrate with an MCP client
At MCP `tools/list` time:

1. Fetch the complete tool list as required by the client/runtime.
2. Validate and cache raw definitions by `(server identity, tool name, definition hash)`.
3. Build host-only routing metadata from server configuration or reviewed local metadata.
4. Do **not** send all full schemas to the model yet.
5. At task invocation, route using the user/task text and current policy.
6. Send only selected full definitions to the model if the host supports per-request tool filtering.
7. Dispatch resulting calls to the original MCP tool implementation.

If the provider supports remote MCP `allowed_tools`, the selected names can be used to construct that filter rather than manually serializing every remote tool definition.

## 5. Integrate with OpenAI remote MCP
OpenAI's Responses API supports an `allowed_tools` list/filter on remote MCP tools. A typical host pattern is:

```text
full remote MCP catalog
→ local routing decision
→ selected tool names
→ Responses API MCP allowed_tools
→ model only receives/uses bounded allowed set according to provider behavior
```

Treat this package as the selection/policy layer; use the provider's native filtering mechanism when available.

Do not assume that filtering behavior, token accounting, or deferred discovery is identical across model/client versions. Measure the actual request/runtime path you deploy.

## 6. Deferred tool discovery
If the client provides native tool search/deferred loading:

- Prefer native deferred loading when it is verified for your active model/client.
- Keep this router as a deterministic fallback and CI budget guard.
- Record whether a task used native discovery or local routing.
- Test essential tool reachability after model/client upgrades.

On discovery failure:

```bash
python scripts/tool_router.py \
  --catalog catalog.json \
  --task-file task.txt \
  --policy config/tool-budget-policy.json \
  --output selected-tools.json \
  --report routing-report.json \
  --fallback
```

The fallback loads essential tools plus at most a bounded number of small additional tools. It never expands to the entire catalog automatically.

## 7. CI integration
Recommended gate:

```bash
python scripts/schema_profiler.py catalog.json \
  --policy config/tool-budget-policy.json \
  --output schema-profile.json

python -m unittest tests/test_tool_budget.py
```

For your production catalog, add a fixture suite:

```json
[
  {
    "task": "query customer invoice table",
    "expected_tools": ["database_query"]
  },
  {
    "task": "find symbol in repository",
    "expected_tools": ["repo_search"]
  }
]
```

Calculate:

```text
selection_recall = selected expected tools / total expected tools
schema_token_reduction = 1 - selected schema tokens / eager schema tokens
```

Block rollout when policy thresholds fail.

## 8. Schema-change discipline
When a tool definition changes:

1. Re-profile.
2. Compare definition hashes.
3. Re-run routing fixtures.
4. Re-run runtime argument validation.
5. If description text was shortened, verify generated calls still contain correct field names/values.
6. Record before/after estimated tokens and tool-call success.

Never remove structural JSON Schema constraints solely to meet a context budget.

## 9. Metrics and observability
Emit safe aggregate telemetry:

```json
{
  "catalog_tool_count": 48,
  "selected_tool_count": 7,
  "catalog_estimated_tokens": 22100,
  "selected_estimated_tokens": 4100,
  "schema_token_reduction_ratio": 0.8145,
  "fallback": false,
  "policy_version": 1
}
```

Do not emit tool arguments, credentials, retrieved documents, or user content merely for routing metrics.

Recommended dashboards:
- schema tokens by catalog version;
- largest tool definitions;
- reduction ratio p50/p95;
- fallback frequency;
- expected-tool miss rate from evals;
- tool-call success by routed vs baseline path.

## 10. Rollout strategy
1. **Observe only:** router computes decisions but eager catalog remains active.
2. **Shadow compare:** compare expected tool and routed selection without changing calls.
3. **Non-destructive tasks:** enable routing for read-only tool groups.
4. **Broader rollout:** enable when recall/call-success thresholds remain stable.
5. **Continuous gate:** catalog changes must pass profile + routing regression tests.

## 11. Failure recovery

| Failure | Action |
|---|---|
| Invalid catalog/schema | Block model exposure |
| Essential tools exceed budget | Hard fail; redesign catalog/budget |
| No keyword match | Essential + bounded smallest fallback |
| Native deferred search unavailable | Use deterministic fallback router |
| Recall regression | Revert policy/routing metadata |
| Tool-call regression after description reduction | Restore original description/schema |
| Token target not met but quality passes | Optimize catalog composition; do not weaken correctness |

## 12. Provider/client adaptation
Different hosts name tool schema fields differently. Write a thin adapter that maps the host's representation into this package's canonical catalog and maps selected definitions back. Keep the adapter deterministic and test it with definition hashes so the callable schema is unchanged through the round trip.
