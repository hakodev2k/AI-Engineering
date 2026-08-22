# Research — MCP Server Instruction Provenance Gate

## Topic
MCP server-provided instructions entering privileged agent context without an explicit trust boundary.

## Category
Security

## Problem
MCP servers can return natural-language instructions and tool metadata that a client may feed into an LLM. If the server is malicious, compromised, or later changes its metadata, those instructions can influence tool choice, data access, or consequential actions. Treating server text as equivalent to trusted system/developer instructions creates a prompt-injection and authority-confusion boundary.

## Why it matters now
A fresh MCP issue published in August 2026 documents `server/discover`/initialization instructions as a prompt-injection surface. Current MCP guidance already says server-provided tool behavior descriptions should be treated as untrusted unless the server itself is trusted. OpenAI also continues to recommend layered prompt-injection defenses, least privilege, and confirmation for consequential actions.

## Affected users
MCP client authors, agent-platform teams, enterprise connector administrators, developers enabling third-party MCP servers, and users of write-capable AI agents.

## Current public evidence
### Observed evidence
1. MCP issue #3213 (MCP-2026-015), disclosed 2026-08-08, describes server-controlled `instructions` entering the model context and recommends isolation, injection detection, and length limits: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
2. MCP specification guidance states that tool descriptions/annotations from servers should be considered untrusted unless obtained from a trusted server and recommends explicit consent/authorization: https://modelcontextprotocol.io/specification/2025-11-25
3. OpenAI prompt-injection guidance recommends layered defenses, restricting access, and confirmation for consequential actions: https://openai.com/safety/prompt-injections/
4. OpenAI developer-mode/MCP guidance warns that unsafe or untrusted MCP servers increase prompt-injection exposure and should be vetted before use: https://help.openai.com/en/articles/12584461-developer-mode-and-full-mcp-connectors-in-chatgpt

## Existing approaches
- Administrative server allowlists.
- Prompt-level warnings such as “treat server text as untrusted.”
- Generic prompt-injection classifiers.
- User confirmation before sensitive actions.
- Server-side truncation/sanitization.

## Remaining limitations
- Trust decisions can outlive changes to server metadata.
- Model-only instructions are probabilistic rather than enforceable.
- Generic injection detection can miss novel phrasing.
- Approval can happen too late if the untrusted text already influenced data retrieval.
- Sanitization/length limits reduce payload size but do not define authority.
- Tool metadata and server instructions often lack deterministic provenance in downstream traces.

## Root-cause analysis
1. Untrusted server text and trusted control instructions share the same natural-language channel.
2. Provenance is often dropped when context is assembled.
3. Trust decisions are not bound to the exact instruction content.
4. High-impact tool authorization is not always re-evaluated at action time.
5. Metadata-change invalidation is rarely enforced.

## Improvement opportunity
Add a deterministic provenance envelope at ingestion time and a policy gate at action time. Hash server instructions, classify server trust, reject malformed/control-character-heavy payloads, keep untrusted text outside trusted instruction layers, and require content-bound approval for high-impact actions influenced by untrusted server text.

## Goal
Prevent server-provided natural language from silently acquiring control-plane authority while preserving useful descriptive metadata.

## Metrics
- 100% MCP instruction payloads receive source, trust, and SHA-256 provenance.
- 100% high-impact tool calls influenced by untrusted MCP text pass a deterministic policy gate.
- 0 untrusted instruction payloads are promoted to trusted/system authority.
- 100% instruction-content changes invalidate prior content-bound approval.
- Malicious fixtures are blocked or require approval; benign fixtures remain usable.

## Trigger
MCP discovery/initialization, metadata refresh, tool-list refresh, or a high-impact tool invocation influenced by MCP-provided natural language.

## Inputs
Server identity, instruction text, previous content hash, trust policy, requested capabilities, user goal, and optional approval record.

## Outputs
Provenance envelope, allow/approval-required/deny decision, reasons, hashes, and audit evidence.

## Interpretation
The evidence does not imply every MCP client is exploitable. It shows a real integration hazard when server-controlled natural language is granted privileged influence without an explicit trust boundary.

## Proposed solution
A reusable provenance-aware ingestion and action-time authorization package with deterministic validation and adversarial regression tests. It reduces exposure but does not claim perfect prompt-injection detection.

## Relevant sources
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
- https://modelcontextprotocol.io/specification/2025-11-25
- https://openai.com/safety/prompt-injections/
- https://help.openai.com/en/articles/12584461-developer-mode-and-full-mcp-connectors-in-chatgpt
