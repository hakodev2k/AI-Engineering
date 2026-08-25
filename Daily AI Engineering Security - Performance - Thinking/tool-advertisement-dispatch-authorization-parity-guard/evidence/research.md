# Research

## Topic
Request-scoped tool advertisement and dispatch authorization parity

## Category
Security

## Problem
A model-visible tool list may be narrower than the executor's resolver. If dispatch accepts a tool name that was not authorized for the current request, prompt injection or model error can reach a capability the request intentionally withheld.

## Why it matters now
On **2026-08-20**, Spring disclosed **CVE-2026-59318** affecting Spring AI 1.0.0–1.0.9, 1.1.0–1.1.8 and 2.0.0. Spring states that the per-request tool list was advertised as a boundary but not fully enforced at dispatch; an unavailable tool could be resolved and executed, potentially escalating privilege. The fixed Spring AI 2.0 documentation now makes resolver fallback disabled by default and warns that enabling it allows resolver-visible tools to execute regardless of request attachment.

## Affected users
Agent-framework maintainers, Spring AI users, platform teams exposing heterogeneous tools, multi-tenant applications, and teams relying on request-level tool filtering as an authorization mechanism.

## Current public evidence
### Observed evidence
1. Spring security advisory CVE-2026-59318, published 2026-08-20: `DefaultToolCallingManager` could invoke a tool not made available to the current request. https://spring.io/security/cve-2026-59318/
2. Current Spring AI tool-calling reference: `spring.ai.tools.resolution.fallback.enabled` defaults to `false`; enabling it allows tools absent from the request to be resolved by name and executed, including risk-tier/destructive tools. https://docs.spring.io/spring-ai/reference/api/tools.html
3. Spring AI issue #6683, opened 2026-07-24, requests a governance advisor because the existing advisor/tool path did not provide a deterministic enterprise authorization boundary for tool calls. https://github.com/spring-projects/spring-ai/issues/6683
4. Spring AI issue #5615 requests tool guardrails that can block tool arguments/results inside the execution lifecycle. https://github.com/spring-projects/spring-ai/issues/5615

### Interpretation
Selection/disclosure and authorization/execution are distinct control planes. Model-visible filtering improves behavior and token use, but security must be revalidated at dispatch with request identity and policy state.

### Proposed solution
Add a deterministic pre-dispatch parity gate that checks the requested tool against the effective request allow-set and explicit global policy. Resolver lookup may locate implementation metadata but MUST NOT widen authority.

## Existing approaches
Upgrade fixed Spring AI versions; keep resolver fallback disabled; request-level tool filtering; tool-local authorization/`ToolContext`; HITL for high-risk actions; custom advisors/guardrails.

## Remaining limitations
Fallback can be re-enabled; custom managers/wrappers can bypass defaults; model-visible filtering is easy to misread as authorization; HITL applies only where configured; tool-local checks may not know orchestrator request scope.

## Root-cause analysis
1. Global registry is used for convenience resolution.
2. Model advertisement is conflated with authorization.
3. Final dispatch lacks mandatory request allow-set comparison.
4. Resolver fallback widens discovery without preserving least privilege.
5. Stable authorization decision evidence is often missing.

## Improvement opportunity
Make the effective request allow-set plus explicit policy the final executable capability set and test that invariant independently of model behavior.

## Goal
Zero successful dispatches outside the effective request allow-set unless a separately authorized global exception exists.

## Metrics
Mismatch attempts; blocked mismatches; fallback dispatches; allowed dispatches; false positives; execution-path coverage.

## Trigger
Before every tool execution and after dynamic tool-list or policy changes.

## Inputs
Request tools, requested tool name, resolver/fallback state, explicit global policy.

## Outputs
ALLOW/BLOCK decision, stable reason code, request ID, sanitized audit record.

## Relevant sources
- https://spring.io/security/cve-2026-59318/
- https://docs.spring.io/spring-ai/reference/api/tools.html
- https://github.com/spring-projects/spring-ai/issues/6683
- https://github.com/spring-projects/spring-ai/issues/5615
- https://spring.io/blog/2026/06/15/spring-ai-composable-tool-calling/
