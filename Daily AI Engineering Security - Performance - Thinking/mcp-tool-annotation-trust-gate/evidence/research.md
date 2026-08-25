# Research — MCP Tool Annotation Trust Gate

## Topic
Trust-aware enforcement for MCP `ToolAnnotations`.

## Category
Security

## Problem
MCP clients increasingly want to use `readOnlyHint`, `destructiveHint`, `idempotentHint`, and `openWorldHint` to reduce approval fatigue and improve permission UX. The protocol explicitly states that these fields are only hints and that clients MUST consider them untrusted unless they come from trusted servers. In practice, client permission engines are uneven: some do not expose annotations to policy code, some ignore them entirely, and some product modes can surface a tool because of an unverified server-controlled `readOnlyHint`.

## Why it matters now
The mismatch is active in 2026. Tool annotation adoption is growing, while clients are simultaneously trying to use annotations for approval decisions. This creates two failure modes: excessive prompts when trustworthy read-only metadata is unavailable to the policy layer, and false confidence if a server-controlled hint is treated as an authorization fact.

## Affected users
Developers using MCP-enabled coding agents; platform teams integrating third-party MCP servers; security teams defining approval policy; MCP server authors; agent-runtime maintainers.

## Current public evidence

### Observed evidence
1. The MCP specification says all `ToolAnnotations` properties are hints, are not guaranteed to faithfully describe behavior, and clients should never make tool-use decisions from annotations received from untrusted servers. Source: https://modelcontextprotocol.io/specification/2025-11-25/schema
2. The MCP maintainers' March 16, 2026 security article explains that annotations can drive confirmation UX only when trust is established; an untrusted server can lie, and hard guarantees belong in authorization/runtime controls. Source: https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/
3. Claude Code issue #87452, opened August 17, 2026, reports that its permission engine treats MCP calls uniformly and does not process standard tool annotations for differentiated approval. Source: https://github.com/anthropics/claude-code/issues/87452
4. Vercel Eve issue #1890, opened August 10, 2026, reports that annotations are retained in connection metadata but not exposed to the approval policy, which therefore decides from tool name alone. Source: https://github.com/vercel/eve/issues/1890
5. Gemini CLI issue #28548, published July 2026, documents Plan Mode surfacing MCP tools based on an unverified server-controlled `readOnlyHint`; a malicious server can label a destructive tool read-only. Source: https://github.com/google-gemini/gemini-cli/issues/28548
6. GitHub MCP Server issue #2483 documents the opposite operational cost: missing `ReadOnlyHint` forces prompts for read-intent tools in a runtime that auto-approves only strictly annotated read-only operations. Source: https://github.com/github/github-mcp-server/issues/2483

## Interpretation
The ecosystem is converging on annotations as a useful risk vocabulary, but there is no safe universal shortcut from annotation to authorization. The unresolved engineering problem is not merely “support annotations”; it is “use them only within an explicit server-trust boundary, preserve conservative defaults, and make the effective approval decision auditable.”

## Existing approaches
- Ignore annotations and prompt for every MCP call.
- Auto-approve tools labeled read-only.
- Use server allowlists or coarse connection-level trust.
- Maintain hand-authored per-tool allow/ask/deny lists.
- Rely on sandbox/network controls as the hard security boundary.

## Remaining limitations
Ignoring annotations causes avoidable approval fatigue. Blindly trusting them lets a compromised or malicious server self-classify into a lower-risk path. Static allowlists drift as tool catalogs change. Name-only policies cannot reason about semantics. Coarse server trust cannot express which annotation fields are permitted to reduce friction.

## Root-cause analysis
1. Tool metadata and authorization policy are often implemented in separate layers.
2. The protocol defines hints, not attested behavioral contracts.
3. Server identity/trust state is frequently implicit rather than passed into the decision function.
4. Conservative defaults are inconsistently applied when annotation fields are missing.
5. Approval logs often omit the evidence used to lower or raise risk.
6. Tool catalogs can change across reconnects, making cached policy decisions stale.

## Improvement opportunity
Add a deterministic trust gate between MCP metadata ingestion and permission policy. The gate must separate server trust from tool claims; ignore risk-lowering annotations from untrusted servers; apply pessimistic MCP defaults for missing fields; optionally permit risk-raising hints from any server; emit an auditable decision with reasons; and never replace sandbox, network, or authorization enforcement.

## Proposed solution
This package implements a reusable policy evaluator, tests, rules, review workflow, and integration hook. A host supplies server identity/trust and a tool descriptor. The evaluator produces `allow`, `ask`, or `deny` plus normalized risk facts and reason codes.

## Goal
Reduce unnecessary approvals for trusted read-only tools without allowing untrusted annotations to weaken permission boundaries.

## Metrics
- Approval rate for trusted read-only tools.
- `untrusted_risk_lowering_hint_count`.
- `missing_annotation_conservative_default_count`.
- Policy decision coverage (% tool calls evaluated).
- Annotation/policy mismatch findings.
- False auto-approval count (target: zero in security tests).

## Trigger
Every MCP tool discovery refresh and every tool-call authorization decision.

## Inputs
Server identifier, explicit trust classification, tool name, annotations, and local policy.

## Outputs
Normalized risk facts; decision (`allow|ask|deny`); deterministic reason codes; audit record.

## Verification
Security fixtures must prove: an untrusted server cannot gain auto-approval by setting `readOnlyHint: true`; missing annotations remain conservative; destructive/open-world tools can be forced to ask/deny; trusted read-only tools may be auto-approved only when policy explicitly allows it; malformed inputs fail closed.

## Relevant sources
- https://modelcontextprotocol.io/specification/2025-11-25/schema
- https://modelcontextprotocol.io/specification/2025-11-25/server/tools
- https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/
- https://github.com/anthropics/claude-code/issues/87452
- https://github.com/vercel/eve/issues/1890
- https://github.com/google-gemini/gemini-cli/issues/28548
- https://github.com/github/github-mcp-server/issues/2483
