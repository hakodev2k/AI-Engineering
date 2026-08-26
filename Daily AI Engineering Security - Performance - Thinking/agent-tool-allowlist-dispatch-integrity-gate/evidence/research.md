# Research — Agent Tool Allowlist Dispatch Integrity Gate

**Category:** Security  
**Research date:** 2026-08-27 (UTC+7)

## Topic
Request-scoped agent/tool allowlists that are advertised or configured but not enforced at the actual dispatch boundary.

## Problem
AI frameworks and multi-agent systems increasingly expose a request-specific tool or subagent set to the model, but several current implementations have allowed the dispatcher to resolve and execute names outside that set. The model-visible capability list therefore looks like an authorization boundary while the runtime path is broader.

## Why it matters now
On August 20, 2026, Spring published CVE-2026-59318 for exactly this pattern: Spring AI's per-request tool list was not fully enforced by `DefaultToolCallingManager`, allowing an unadvertised tool to be resolved globally and invoked under certain conditions. On August 15, 2026, a VS Code issue reported that custom-agent `agents:` frontmatter was parsed but not enforced by `RunSubagentTool`, so a coordinator could invoke enabled agents outside its declared list. A June 2026 ZeroClaw issue described a separate execution lane that skipped its policy tool filter.

## Affected users
Agent-framework maintainers, platform builders, application teams registering sensitive tools, multi-agent orchestrators, and developers relying on request- or role-scoped tool lists.

## Current public evidence

### Observed evidence
1. Spring security advisory CVE-2026-59318, published 2026-08-20, states that a tool not made available to the current request could be invoked because global resolver fallback bypassed the request-scoped boundary. Fixed versions include Spring AI 2.0.1, 1.1.9 and 1.0.10 where applicable.  
   https://spring.io/security/cve-2026-59318/
2. VS Code issue #331002, opened 2026-08-15, reports that the documented custom-agent `agents:` allowlist is parsed but not checked before `runSubagent` dispatch, permitting invocation of an enabled agent outside the caller's allowlist.  
   https://github.com/microsoft/vscode/issues/331002
3. ZeroClaw issue #7063, opened 2026-06-01, reports that channel-served agents bypassed the per-agent tool allowlist because one execution path skipped `apply_policy_tool_filter`.  
   https://github.com/zeroclaw-labs/zeroclaw/issues/7063

### Interpretation
These are independent products with the same control-plane failure: configuration or advertisement is mistaken for enforcement. The authorization decision must be repeated at the final dispatcher using the effective request/agent identity, not inferred from what the model was shown.

## Existing approaches
- Upgrade to fixed framework versions when a vendor patch exists.
- Filter tool schemas before the model call.
- Configure per-agent tool/subagent allowlists.
- Require human approval for sensitive tools.
- Register fewer sensitive tools globally.
- Add tool guardrails around arguments and outputs.

## Remaining limitations
- Model-visible filtering alone does not constrain a runtime resolver.
- Multiple execution lanes can apply policy inconsistently.
- Global registries create fallback paths that silently widen authority.
- Human approval may happen after a bad capability has already been selected and can suffer approval fatigue.
- Nested delegation can lose the caller's effective allowlist unless identity and scope are explicitly propagated.

## Root-cause analysis
1. Capability discovery and capability authorization are implemented in different layers.
2. Dispatchers use global lookup fallback when request-local lookup fails.
3. Policy checks are duplicated across lanes rather than centralized at execution.
4. Effective principal, request scope and delegated scope are not carried in a signed/structured execution envelope.
5. Tests validate which tools are shown, not which tools can actually execute.

## Improvement opportunity
Add a fail-closed dispatch gate that binds `principal`, `request_id`, requested capability and effective allowlist immediately before execution. Reject any capability absent from the effective set even if a global resolver can find it. Add negative regression fixtures for hidden tools, nested delegation and alternate lanes.

## Relevant sources
- Spring CVE-2026-59318: https://spring.io/security/cve-2026-59318/
- VS Code issue #331002: https://github.com/microsoft/vscode/issues/331002
- ZeroClaw issue #7063: https://github.com/zeroclaw-labs/zeroclaw/issues/7063
