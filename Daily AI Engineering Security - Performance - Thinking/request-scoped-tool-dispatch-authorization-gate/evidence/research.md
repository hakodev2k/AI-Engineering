# Research — Request-Scoped Tool Dispatch Authorization Gate

## Topic
Request-scoped tool dispatch authorization must be enforced at execution time, not merely advertised to the model.

## Category
Security

## Problem
Agent frameworks commonly expose a request-specific subset of tools to an LLM. If dispatch resolves a returned tool name against a broader/global registry, prompt injection or malformed model output can invoke a tool that was never authorized for that request.

## Why it matters now
On 2026-08-20 Spring published CVE-2026-59318 for exactly this class: Spring AI's per-request tool list was advertised as a boundary but not fully enforced by `DefaultToolCallingManager` dispatch. The affected ranges include 2.0.0, 1.1.0–1.1.8, and 1.0.0–1.0.9; fixed releases include 2.0.1, 1.1.9, and 1.0.10. A separate June 2026 Spring AI issue documents runtime/dynamically injected tools and advisor registration complexity, showing that the tool set is genuinely dynamic and therefore easy to mishandle across planning and dispatch layers.

## Affected users
Developers building multi-tenant or privilege-tiered agent applications; platform teams registering administrative and user tools in one process; users exposed to indirect prompt injection; security teams reviewing agent authorization boundaries.

## Current public evidence
### Observed evidence
1. Spring Security Advisory CVE-2026-59318, published 2026-08-20: a tool not made available to the current request could be invoked because the per-request list was not fully enforced at dispatch. Source: https://spring.io/security/cve-2026-59318/
2. Spring AI GitHub issue #6325, opened 2026-06-07, describes dynamically injected runtime tools and advisor registration behavior. This independently demonstrates that request-time tool topology is mutable and not equivalent to a static global registry. Source: https://github.com/spring-projects/spring-ai/issues/6325
3. SentinelOne's 2026-08-28 analysis identifies the root cause as resolution against a broader registry instead of the current request scope and recommends callback-level authorization as defense in depth. Source: https://www.sentinelone.com/vulnerability-database/cve-2026-59318/

### Interpretation
The failure is not "the model chose the wrong tool"; it is a confused authorization architecture. The model-visible list is policy metadata. The actual security boundary is the deterministic dispatcher immediately before side effects. Dynamic registration, advisors, MCP aggregation, and shared registries increase the probability that these two sets diverge.

### Proposed solution
Add a deterministic pre-dispatch gate that computes an immutable request authorization set, canonicalizes tool identity, verifies every requested tool against that set, optionally evaluates subject/tenant/action constraints, and blocks before callback resolution when any invariant fails. Log the decision without secrets. Verify with negative tests that forged/unadvertised tool names never reach the callback.

## Existing approaches
- Upgrade affected Spring AI versions to patched releases.
- Reduce globally registered privileged tools.
- Enforce authorization inside sensitive tool callbacks.
- Sanitize untrusted prompt content and use human approval for high-risk actions.

## Remaining limitations
Patching a framework version fixes a known implementation but does not prove application-level authorization remains correct after custom resolvers, wrappers, middleware, MCP gateways, aliases, or future refactors. Callback-only authorization duplicates policy across tools and can drift. Prompt filtering cannot be treated as authorization because injection defenses are probabilistic.

## Root-cause analysis
- Policy is represented twice: once in the model-visible tool list and again implicitly in resolver state.
- Global registries are convenient but exceed request scope.
- Tool aliases/canonicalization can make string comparisons inconsistent.
- Security tests often exercise happy-path tool calling but not forged model outputs.
- Authorization is sometimes delegated to model behavior rather than a deterministic side-effect boundary.

## Improvement opportunity
Create a reusable, framework-neutral conformance gate and test harness that treats the model as untrusted. It verifies `requested_tool ∈ authorized_tools(request, subject, tenant)` before resolution or execution and produces machine-readable evidence.

## Metrics
- unauthorized dispatch attempts blocked: 100%
- callback executions for unadvertised tools: 0
- authorization decision coverage for sensitive tools: 100%
- false-denial rate on authorized regression corpus
- policy evaluation latency p50/p95

## Trigger
Any agent request whose authorized tool set is narrower than the process/global registry, or any system using dynamic tool registration, multi-tenancy, privilege tiers, or untrusted retrieved content.

## Inputs
Request ID, subject/tenant identity, advertised tool names, global registry names, requested tool call name/arguments, optional policy attributes.

## Outputs
ALLOW/DENY decision, canonical tool identity, reason code, evidence record, test report.

## Relevant sources
- https://spring.io/security/cve-2026-59318/
- https://github.com/spring-projects/spring-ai/issues/6325
- https://www.sentinelone.com/vulnerability-database/cve-2026-59318/
