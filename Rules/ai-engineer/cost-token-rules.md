# Cost and Token Rules
## Purpose
Control AI operating cost without hiding quality or safety trade-offs.
## Scope
Tokens, model calls, embeddings, retrieval, caching, batch processing, and provider billing.
## MUST
- Measure token usage and cost for material production workflows.
- Define budgets or guardrails for loops, retries, long contexts, and agentic execution.
- Evaluate cost impact before model, prompt, context, or retrieval changes are widely released.
- Preserve required quality and safety when optimizing cost.
## MUST NOT
- Allow unbounded autonomous loops or retries with billable external calls.
- Claim a cost optimization without comparable before/after measurements.
## SHOULD
- Use caching, batching, smaller models, context reduction, or routing when evaluation confirms acceptable behavior.
## Exceptions
Temporary budget increases require documented need, owner, monitoring, and expiry or review point.
## Verification
Inspect usage dashboards, budgets, traces, evaluation results, and before/after cost measurements.