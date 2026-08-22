# Research — Tool Policy Fail-Closed Invariant Gate

## Topic
Tool Policy Fail-Closed Invariant Gate

## Category
Security

## Problem
Agent runtimes can interpret an explicit restricted or empty tool policy as if no policy were supplied, or enforce the policy in one execution mode but ignore it in another. The result is a fail-open capability boundary: a model can see or execute tools that an agent profile explicitly intended to remove.

## Why it matters now
Two independent August 2026 bug reports show this failure pattern in actively used coding-agent runtimes. The common risk is not model behavior but inconsistent policy semantics across configuration parsing, provider-visible schemas, subagents, execution modes, and runtime dispatch.

## Affected users
AI coding-agent users, multi-agent platform builders, teams relying on per-agent least privilege, security engineers, and developers exposing shell/file/network tools.

## Current public evidence
### Observed evidence
1. NousResearch/hermes-agent issue #84289, opened 2026-08-12, reports that `enabled_tools=[]` or a list containing no sandbox-capable tools results in all sandbox helpers becoming available. The reported root cause treats an empty intersection as missing configuration and falls back to `SANDBOX_ALLOWED_TOOLS`: https://github.com/NousResearch/hermes-agent/issues/84289
2. MoonshotAI/kimi-code issue #2765, opened 2026-08-09, reports that agent-profile `tools`/`disallowedTools` restrictions are ignored in interactive mode while the same policy is enforced in prompt mode under the experimental flag: https://github.com/MoonshotAI/kimi-code/issues/2765
3. OWASP's AI Agent Security Cheat Sheet recommends minimum tool access, independent authorization for sensitive operations, and fail-closed behavior when policy lookup or approval validation fails: https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html
4. OWASP's Authorization Cheat Sheet recommends least privilege and safe failure handling for access-control checks: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html

## Existing approaches
- Per-agent allowlists and denylists.
- Global tool switches intersected with agent-specific policy.
- Provider-side filtering of tool schemas.
- Runtime execution checks before dispatch.
- Prompt instructions telling an agent not to use forbidden tools.

## Remaining limitations
A policy can still fail open when `None`, missing, and explicit-empty states are conflated; when different modes use different policy paths; when provider-visible tools and execution-time tools diverge; or when a fallback restores capabilities after a filtered set becomes empty. Prompt-only restrictions are not an authorization boundary.

## Root-cause analysis
- Loss of three-state semantics: absent vs explicit-empty vs explicit non-empty.
- Truthiness-based fallback logic (`if not tools`) instead of explicit state handling.
- Multiple policy implementations for interactive, batch, subagent, and sandbox paths.
- No deterministic comparison between declared policy, provider-visible tools, and executable tools.
- Security fallback behavior optimized for compatibility rather than least privilege.

## Improvement opportunity
Create a reusable invariant gate that normalizes policy state, computes the maximum allowed set, compares it with both provider-visible and runtime-executable tool sets, rejects denied or undeclared exposure, and fails closed on unresolved policy state. Explicit empty restrictions must remain empty unless product semantics explicitly document otherwise and the caller records that semantics.

## Interpretation
The evidence does not prove all agent frameworks have the same bug. It demonstrates a recurring implementation class: capability policy intent can be broadened by fallback or mode-specific enforcement. The appropriate reusable control is deterministic policy-to-effective-capability verification rather than additional model instructions.

## Proposed solution
Use `scripts/tool_policy_gate.py` at agent/session initialization and after policy/tool-registry changes. Feed it the declared policy state plus observed provider-visible and runtime-executable tool sets. Block startup or high-impact execution on violations. Add regression tests for explicit-empty, denied tools, mode mismatch, and compliant restriction cases.

## Goal
Ensure an effective tool set never exceeds the declared policy boundary and ambiguous policy failures never broaden privileges.

## Metrics
- Effective-tool policy violations: 0.
- Forbidden tools visible to model: 0.
- Forbidden tools executable at runtime: 0.
- Policy checks performed at required boundaries: 100%.
- Explicit-empty regression fixtures passing: 100%.

## Trigger
Agent creation, mode switch, subagent creation, tool-registry refresh, policy hot reload, sandbox initialization, or execution of a sensitive tool.

## Inputs
Policy presence, allowlist, denylist, known tool universe, provider-visible tools, runtime-executable tools, execution mode, and optional policy revision.

## Outputs
Pass/block decision, normalized allowed set, violations, and audit evidence.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/84289
- https://github.com/MoonshotAI/kimi-code/issues/2765
- https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
