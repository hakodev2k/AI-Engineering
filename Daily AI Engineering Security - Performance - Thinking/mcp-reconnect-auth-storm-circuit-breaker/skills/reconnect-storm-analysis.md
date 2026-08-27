# Skill: Reconnect Storm Analysis

## Purpose
Measure and reduce redundant MCP connect/auth/discovery work without hiding real transport failures.

## Trigger
Repeated MCP connection messages, OAuth prompts, 429s, `-32001` timeouts, large first-response latency, or repeated tool-schema/context injection.

## Inputs
Timestamped endpoint events, auth subject (non-secret identifier), catalog identity, tool-list refreshes, schema reinjection tokens, latency and error counts.

## Preconditions
Observability can distinguish connect, OAuth start, discovery/tool-list, useful tool calls, 429, timeout, and schema reinjection.

## Required context
Normalized endpoint identity and trusted performance policy only.

## Allowed tools
Read-only logs/traces, `scripts/reconnect_budget_guard.py`, tests, benchmark harness.

## Constraints
MUST establish a baseline before changes. MUST NOT disable authentication, TLS, issuer validation, approval, or other security controls for speed.

## Procedure
1. Normalize endpoint+auth-subject+catalog identity into one work key.
2. Capture a fixed baseline window: connects, OAuth starts, tool-list calls, useful tool calls, schema reinjection tokens, p50/p95 first-response latency, 429s/timeouts.
3. Run the budget guard and identify redundant work.
4. Form one hypothesis: single-flight, cached discovery, lazy loading, or bounded retry budget.
5. Implement one mechanism at a time.
6. Rerun the same workload and compare before/after.
7. Accept only if useful work succeeds with lower redundant calls/latency/token overhead and no security regression.

## Decision points
If failures are endpoint-health failures rather than redundant client work, do not mask them with larger retry budgets; escalate upstream.

## Expected output
Baseline, root cause, selected hypothesis, before/after metrics, regression status.

## Metrics
Connects/session, OAuth starts/session, tool-list refreshes/session, schema reinjection tokens/session, useful tool calls/connect, first-response p50/p95, 429/timeouts, task success rate.

## Verification
Independent reviewer reproduces the benchmark and confirms security settings are unchanged or stricter.

## Failure handling
Maximum 2 optimization revisions; fallback to previous verified behavior and surface upstream failure.

## Stop conditions
Stop on authentication/security weakening, task-success regression, exhausted retries, or insufficient evidence to distinguish redundancy from real recovery.
