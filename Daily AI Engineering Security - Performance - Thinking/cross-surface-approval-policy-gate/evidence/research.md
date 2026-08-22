# Research — Cross-Surface Approval Policy Gate

## Topic
Cross-Surface Approval Policy Gate

## Category
Security

## Problem
Agent safety policies are often enforced per tool implementation instead of per capability. Equivalent high-impact actions can therefore receive different approval treatment depending on whether they are reached through terminal, file tools, MCP wrappers, subagents, or nested agents.

## Why it matters now
Current 2026 reports show approval coverage gaps across multiple agent tool surfaces, including newly reported file/terminal inconsistencies and nested-agent approval failures.

## Affected users
Agent framework maintainers, MCP users, platform/security teams, coding-agent operators, and applications granting filesystem/process/infrastructure capabilities.

## Current public evidence
### Observed evidence
1. Hermes Agent issue #85321, opened August 13, 2026, reports shell startup files gated through terminal but writable through file tools without the same prompt, plus uncovered `touch`/`mkdir`/`ln` paths: https://github.com/NousResearch/hermes-agent/issues/85321
2. Hermes Agent issue #32877, opened May 26, 2026, reports dangerous-command approval wired to terminal while MCP-wrapped commands could reach subprocess execution without the same gate or audit entry: https://github.com/NousResearch/hermes-agent/issues/32877
3. Microsoft Agent Framework issue #6062, opened May 24, 2026, reports a human approval function working when Agent B is invoked directly but not when Agent B is invoked as a tool by a triage agent: https://github.com/microsoft/agent-framework/issues/6062
4. MCP 2026-07-28 security best practices explicitly document confused-deputy and authorization risks in MCP intermediaries: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/docs/2026-07-28/tutorials/security/security_best_practices.mdx

### Interpretation
The common weakness is policy attachment to invocation route rather than normalized capability and target. A secure-by-default gate should evaluate intended effect regardless of which tool surface exposes it.

## Existing approaches
- Per-tool regex/pattern approval checks.
- Tool-local approval metadata.
- MCP/server-specific authorization.
- Human approval wrappers on selected functions.

## Remaining limitations
- Equivalent effects can bypass checks through another tool surface.
- Regex command checks do not naturally cover non-shell APIs.
- Nested-agent/tool delegation may lose approval metadata.
- Independent gates create audit gaps and policy drift.

## Root-cause analysis
1. Authorization/approval is bound to tool name, not capability/effect.
2. Tool registries lack normalized capability labels and target classes.
3. Delegation may not propagate original approval obligations.
4. Policy evaluation happens inside individual adapters rather than at one execution boundary.
5. Tests cover tools independently instead of cross-surface equivalence cases.

## Improvement opportunity
Introduce a central capability-policy decision point immediately before side effects. Every adapter maps a request to normalized capability, target, impact, identity, and provenance. The gate denies unknown high-impact capabilities by default, requires approval according to policy, and emits one audit record regardless of invocation surface.

## Goal
Ensure equivalent high-impact actions receive equivalent approval and authorization decisions across terminal, file, MCP, nested-agent, and custom tool surfaces.

## Metrics
- uncovered_high_impact_surface_count (target 0)
- cross_surface_policy_consistency_rate (target 100%)
- approval_bypass_fixture_pass_rate (target 100%)
- unknown_capability_denial_rate
- audited_high_impact_action_rate (target 100%)

## Trigger
Immediately before any tool or delegated agent performs a capability classified medium/high impact.

## Inputs
Tool name, normalized capability, target, arguments hash, actor/session, provenance, delegation chain, requested effect, existing approval evidence.

## Outputs
allow / approval_required / deny, policy reason, capability mapping, approval binding, and audit record.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/85321
- https://github.com/NousResearch/hermes-agent/issues/32877
- https://github.com/microsoft/agent-framework/issues/6062
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/docs/2026-07-28/tutorials/security/security_best_practices.mdx
