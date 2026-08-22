# Research — MCP Server Instruction Trust Boundary Guard

## Topic
MCP Server Instruction Trust Boundary Guard

## Category
Security

## Problem
MCP clients may place server-controlled natural-language `instructions` into privileged model context. A malicious or compromised MCP server can therefore influence tool selection, data handling, or downstream actions through prompt injection. The risk increases when server metadata is cached or reused across users/sessions.

## Why it matters now
On 2026-08-08, MCP issue #3213 documented that `server/discover`/`initialize` instructions are server-controlled, lack protocol-level sanitization/length guarantees, and can become a prompt-injection surface. Current MCP guidance also states that tool descriptions/annotations from servers should be treated as untrusted unless the server is trusted. OpenAI continues to describe prompt injection from third-party content as an evolving security challenge requiring layered defenses and least privilege.

## Affected users
MCP client authors, agent-platform teams, developers enabling third-party MCP servers, enterprise connector administrators, and users of agents with write-capable tools.

## Observed evidence
1. MCP issue #3213, opened 2026-08-07 and disclosed 2026-08-08, describes server-controlled `instructions` flowing into model context and proposes isolation, detection, and length limits: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
2. MCP specification guidance says tool behavior descriptions/annotations should be considered untrusted unless obtained from a trusted server, and recommends explicit consent/authorization: https://modelcontextprotocol.io/specification/2025-11-25
3. OpenAI's prompt-injection guidance recommends layered defenses, limiting agent access, confirmations for consequential actions, and explicit user intent: https://openai.com/safety/prompt-injections/
4. OpenAI's MCP/developer-mode guidance warns that unsafe or untrusted MCP servers increase prompt-injection exposure and should be vetted before deployment: https://help.openai.com/en/articles/12584461-developer-mode-and-full-mcp-connectors-in-chatgpt

## Existing approaches
- Trust the MCP server and include instructions directly in model context.
- Wrap server metadata in a distinct block and tell the model it is untrusted.
- Vet servers administratively before enabling them.
- Require user confirmation for risky actions.
- Apply generic prompt-injection detection.

## Remaining limitations
Administrative vetting is not continuous, server content can change after approval, model-only instructions are probabilistic, and generic detectors can miss novel injections. Confirmation may occur too late if malicious server instructions already influenced data retrieval or disclosure. Length limits reduce abuse volume but do not establish provenance or authorization boundaries.

## Root-cause analysis
- Control-plane metadata and untrusted server content are represented as undifferentiated natural language.
- Clients often lack a deterministic provenance label for each instruction source.
- Tool authorization is not always re-evaluated at action time against the user's original goal.
- Server metadata changes are rarely integrity-checked between sessions.
- Prompt-injection detection is commonly advisory rather than a blocking policy input.

## Improvement opportunity
Introduce a deterministic ingestion and action-time guard: label MCP instruction provenance, normalize and hash it, enforce size/control-character policy, classify trust, keep it outside trusted system instructions, and require a policy check before any capability that can write, execute, reveal secrets, or access unrelated resources. Changes in server-instruction hashes invalidate prior trust decisions.

## Goal
Block or quarantine untrusted MCP instructions from silently gaining control-plane authority while preserving safe descriptive metadata.

## Metrics
- 100% MCP instruction sources receive provenance/trust labels.
- 100% high-impact tool calls are checked against instruction provenance.
- 0 untrusted instruction blocks are promoted to trusted/system authority.
- 100% server-instruction changes invalidate cached approval state.
- Malicious fixtures are blocked; benign fixtures remain usable.

## Trigger
MCP server discovery/initialization, server metadata refresh, tool-list refresh, or high-impact tool invocation influenced by MCP-provided natural language.

## Inputs
Server identity, instruction text, metadata hash, trust policy, requested tool/capabilities, user goal, and optional approval record.

## Outputs
Normalized instruction envelope, allow/quarantine/approval-required/deny decision, reasons, hashes, and audit record.

## Interpretation
The evidence does not show that every MCP client is vulnerable. It shows a real protocol-integration hazard when server-controlled natural language is granted privileged influence without a trust boundary.

## Proposed solution
A reusable provenance-aware instruction gate plus action-time authorization workflow, with deterministic validation and adversarial regression fixtures. This proposal is an engineering mitigation, not a claim that prompt injection can be perfectly detected.