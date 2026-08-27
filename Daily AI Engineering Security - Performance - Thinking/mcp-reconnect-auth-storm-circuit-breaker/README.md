# MCP Reconnect/Auth Storm Circuit Breaker

**Category:** Performance

## Problem
MCP clients can repeatedly reconnect an endpoint, restart OAuth, refresh tool catalogs, and reinject tool schemas. Retry layers may multiply one another, turning one logical session into dozens of maintenance cycles, high first-response latency, 429/timeouts, and token waste.

## Evidence
See `evidence/research.md` for current signals from GitHub Copilot CLI #3706, Claude Code #43895/#84692, and the MCP 2026-07-28 stateless/cacheable-list release.

## Existing approach
Backoff, connection pooling, OAuth token caching, lazy loading, tool-list caching, and MCP's stateless protocol/cache hints reduce some overhead.

## Existing limitations
Backoff still permits redundant successful reconnects; retry budgets can multiply across layers; cache/auth work may not share a stable identity; reconnects may repeatedly inject tool schemas into model context; maintenance cost is often unmeasured.

## Proposed improvement
Use a normalized endpoint+auth-subject+catalog key, single-flight equivalent initialization, bounded per-window budgets, fresh catalog reuse, cooldown after budget exhaustion, and explicit measurement of schema reinjection tokens and latency.

## Architecture
```text
mcp-reconnect-auth-storm-circuit-breaker/
├── README.md
├── evidence/research.md
├── config/policy.json
├── scripts/reconnect_budget_guard.py
├── tests/test_reconnect_budget_guard.py
├── skills/reconnect-storm-analysis.md
├── rules/performance-budget.md
├── subagents/performance-verifier.md
├── workflows/measure-optimize-verify.md
└── hooks/post-window-budget-check.md
```

## Installation
Python 3.10+; standard library only. Instrument the MCP client/orchestrator to emit timestamped non-secret maintenance events.

## Configuration
`config/policy.json` defines a sliding observation window and explicit limits for connection attempts, OAuth starts, tool-list refreshes, schema reinjection tokens, catalog TTL, and cooldown.

## Usage
Provide an array of events:
```json
[
  {"ts": 1000, "event":"connect", "endpoint":"https://mcp.example.com/api", "auth_subject":"user-1", "catalog_id":"v1"},
  {"ts": 1001, "event":"tools_list", "endpoint":"https://mcp.example.com/api", "auth_subject":"user-1", "catalog_id":"v1"}
]
```
Run:
`python scripts/reconnect_budget_guard.py --events events.json --policy config/policy.json`

## Workflow
Use `workflows/measure-optimize-verify.md`: Measure → Diagnose → Hypothesize → Optimize → Measure again → bounded re-evaluation → independent verification.

## Metrics
- Connect attempts per logical session/window
- OAuth starts per key
- Tool-list refreshes per key
- Useful tool calls per connect
- Schema reinjection tokens
- First-response p50/p95 latency
- 429/timeouts
- Task success rate and total task latency

## Verification
Run `python -m unittest tests/test_reconnect_budget_guard.py`. Then reproduce the same baseline workload before/after the client optimization. A claimed improvement requires lower redundant calls, token overhead, or latency with task success maintained.

## Safety
Performance work MUST NOT weaken authentication, TLS, issuer validation, endpoint validation, credential isolation, or user approval. Budget exhaustion should stop automatic churn, not bypass security.

## Failure handling
**Detection:** guard violation, benchmark regression, 429/timeout spike, or repeated maintenance events.  
**Evidence:** timestamped non-secret trace plus before/after metrics.  
**Retry policy:** maximum 2 optimization revisions.  
**Fallback:** rollback to prior verified behavior, apply cooldown, surface upstream failure.  
**Escalation:** endpoint/client owner with trace evidence.  
**Stop condition:** security regression, task-success regression, insufficient evidence, or exhausted retries.

## Definition of Done
**Implemented:** single-flight/budget/cache mechanism integrated at the identified churn source.  
**Measured:** baseline and post-change metrics collected on the same workload.  
**Verified:** unit tests pass; redundant work decreases materially; task success is preserved; no security control is weakened; independent verifier reproduces the result.

## Customization
Tune budgets from real baselines rather than arbitrary larger retry counts. Add metrics for provider-specific handshake/discovery events while preserving the normalized work key.
