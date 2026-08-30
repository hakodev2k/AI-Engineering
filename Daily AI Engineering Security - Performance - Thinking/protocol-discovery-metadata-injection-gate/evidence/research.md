# Research

## Topic
Protocol Discovery Metadata Injection Gate

## Category
Security

## Problem
Agent clients consume server-controlled natural-language discovery metadata and may place it into LLM context. A malicious or compromised MCP/A2A endpoint can therefore supply text that looks like trusted operational guidance and attempt to redirect tool choice, request secrets, or induce high-impact actions.

## Why it matters now
MCP's 2026-07-28 revision introduced `server/discover`; its response includes an optional `instructions` string explicitly described as natural-language guidance for LLMs. In August 2026, public reports independently flagged prompt-injection surfaces in both MCP discovery instructions and A2A AgentCard fields. This is a cross-protocol client-design problem rather than a single-server bug.

## Affected users
Developers building MCP/A2A clients, AI-agent platforms, IDE/coding-agent users, enterprise tool registries, multi-agent orchestrators, and operators connecting agents to third-party servers.

## Current public evidence
### Observed evidence
1. **MCP issue #3213, opened 2026-08-07.** Reports that `server/discover`/legacy initialization can carry server-controlled `instructions` that clients may insert into model context, creating a prompt-injection surface. https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
2. **A2A samples issue #687, opened 2026-08-09.** Reports that a reference client renders AgentCard `description`/`skills` into an LLM prompt, allowing a malicious A2A server to inject instructions. https://github.com/a2aproject/a2a-samples/issues/687
3. **MCP Discovery specification.** The draft `server/discover` response defines `instructions` as optional natural-language guidance for LLMs. https://modelcontextprotocol.io/specification/draft/server/discover
4. **MCP 2026-07-28 release.** Documents the new discovery flow replacing the initialization handshake for modern clients. https://blog.modelcontextprotocol.io/posts/2026-07-28/
5. **OWASP Agentic AI AAI7, published 2026-08.** Treats external tool output as untrusted data and recommends instruction/data separation, least privilege, human approval for high-impact actions, and source-aware monitoring. https://cornucopia.owasp.org/edition/companion/AAI7/1.0/en

## Interpretation
Transport authentication or a registry identity answers *who served the metadata*, not *whether the natural-language content should receive instruction authority*. The recurring weakness is provenance collapse: remote descriptive data and trusted orchestration instructions are flattened into the same model context.

## Existing approaches
- TLS/authentication and registry identity establish endpoint identity.
- Client prompts may tell the model to ignore malicious instructions.
- Pattern filters can remove obvious phrases.
- Tool permission systems and approval dialogs constrain some actions.
- Human review is used for irreversible operations.

## Remaining limitations
- Authenticated servers can still be malicious or compromised.
- Prompt-only separation is probabilistic and can be bypassed.
- Regex filtering is incomplete and language-dependent.
- A safe description can still attempt to expand scope indirectly.
- Permission checks applied only after model planning may lack source provenance, making it difficult to tell whether remote metadata influenced an action.

## Root-cause analysis
1. Discovery metadata is treated as semantically trusted because it is needed for tool selection.
2. Prompt builders lack typed trust labels and flatten instruction/data channels.
3. Authorization is sometimes derived from model interpretation rather than a separate deterministic policy.
4. Metadata length and schema constraints do not necessarily bound semantic influence.
5. Action logs often omit the source material that influenced a decision.

## Improvement opportunity
Introduce a reusable discovery ingress boundary that preserves provenance, constrains size/schema, marks remote natural language as data-only, performs defense-in-depth risk scanning, keeps the action allowlist external to model-generated text, and emits deterministic audit evidence for high-impact actions.

## Goal
Prevent remote discovery metadata from obtaining instruction authority or expanding agent permissions while preserving useful benign descriptions.

## Metrics
Attack-triggered unauthorized actions = 0; malicious metadata quarantined or data-quoted; benign discovery preservation rate; false-positive rate; governed-action provenance coverage; test pass rate.

## Trigger
Any new/changed MCP server, A2A AgentCard, tool registry entry, remote capability refresh, or discovered natural-language metadata.

## Inputs
Raw discovery payload, endpoint identity, protocol/version, local allowlist, action-risk policy.

## Outputs
Normalized metadata envelope, findings, safe data-only representation, allowed action scope, approval requirement, audit record.

## Relevant sources
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
- https://github.com/a2aproject/a2a-samples/issues/687
- https://modelcontextprotocol.io/specification/draft/server/discover
- https://blog.modelcontextprotocol.io/posts/2026-07-28/
- https://cornucopia.owasp.org/edition/companion/AAI7/1.0/en
- https://owasp.org/www-project-mcp-top-10/2025/MCP10-2025%E2%80%93ContextInjection%26OverSharing
