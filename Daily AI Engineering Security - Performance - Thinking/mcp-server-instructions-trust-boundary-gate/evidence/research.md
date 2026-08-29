# Research

## Topic
MCP Server Instructions Trust-Boundary Gate

## Category
Security

## Problem
Natural-language `instructions`, tool descriptions, annotations, and discovery metadata are controlled by an MCP server. If a client blends this material into trusted policy or lets it influence privileged actions without an independent authorization boundary, a malicious or compromised server can prompt-inject the agent.

## Why it matters now
On Aug 7, 2026, modelcontextprotocol/modelcontextprotocol issue #3213 reported that `server/discover` and initialization `instructions` can carry arbitrary server-controlled text and described a prompt-injection/cross-user cache-poisoning chain. The issue is recent, while existing MCP guidance already warns that server-provided descriptions/annotations are untrusted unless the server itself is trusted.

## Affected users
MCP client/host developers; coding-agent users; platform teams connecting third-party MCP servers; enterprises operating multi-server agent sessions.

## Current public evidence
### Observed evidence
1. MCP issue #3213, opened Aug 7, 2026: server-controlled `instructions` in discovery/initialization can be passed into LLM context with no inherent sanitization/length guarantee. https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
2. MCP specification security principles state that tools represent arbitrary code execution and descriptions/annotations should be considered untrusted unless obtained from a trusted server. https://modelcontextprotocol.io/specification/2025-11-25
3. MCP blog, Mar 16, 2026: tool annotations are risk vocabulary, not enforcement; an untrusted server can lie; soft signals including server instructions must not provide hard guarantees. https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/
4. OWASP MCP Top 10 identifies Tool Poisoning and Prompt Injection via Contextual Payloads as explicit MCP risks. https://owasp.org/www-project-mcp-top-10/
5. ClawGuard (Apr 2026) demonstrates that deterministic tool-call boundary enforcement can mitigate indirect prompt injection across web/local content, MCP server injection, and skill files without relying only on model alignment. https://arxiv.org/abs/2604.11790

### Interpretation
The protocol needs to transport server guidance, but transport origin does not imply policy authority. Injection detection and prompt delimiters may reduce risk, yet they cannot guarantee that adversarial natural language will never influence the model. The enforceable boundary must therefore sit at the host/tool-call layer.

## Existing approaches
Prompt-injection classifiers; wrapping untrusted text in delimiters; user confirmation; least privilege; MCP annotations; allowlists; sandbox/network restrictions; model safety training.

## Remaining limitations
Classifiers can miss novel attacks. Delimiters remain model-visible text. Users may approve confusing requests. Annotations are self-asserted by servers and not enforcement. A trusted prompt prefix can accidentally include untrusted server content. Tool authorization often happens after the model has already selected a dangerous action.

## Root-cause analysis
- Conflation of metadata transport with authority.
- Server prose can be merged into a trusted system layer.
- Trust decisions are implicit rather than origin-tagged.
- Side-effect authorization may depend on model interpretation.
- Missing deterministic policy comparison between user intent and requested capability.
- Insufficient provenance/logging for why a tool call was allowed.

## Improvement opportunity
Treat every server-controlled natural-language field as tainted unless explicit server trust is established. Preserve provenance, enforce length/control-character limits, expose text only in an untrusted context channel, and run requested side effects through an external capability/approval gate independent of model instructions.

## Goal
Ensure malicious MCP server guidance cannot grant itself authority, override host policy, or silently cause privileged side effects.

## Metrics
Attack fixtures blocked; privileged calls requiring approval; untrusted-to-trusted promotions (target 0); unauthorized action attempts; legitimate control pass rate; security regression rate; secret exposure (target 0).

## Trigger
Connecting a new/changed MCP server, receiving server instructions, refreshing tool metadata, or executing a tool whose authorization rationale references server-provided text.

## Inputs
Server trust state; `instructions`; tool descriptions/annotations; user-stated objective; host capability policy; requested tool/action.

## Outputs
Sanitized metadata, provenance labels, risk findings, allow/require-approval/block verdict, audit record.

## Proposed solution
This package provides a reusable host-side gate and deterministic scanner. It complements, rather than replaces, model hardening, sandboxing, network controls, and human approval.

## Relevant sources
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
- https://modelcontextprotocol.io/specification/2025-11-25
- https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/
- https://owasp.org/www-project-mcp-top-10/
- https://arxiv.org/abs/2604.11790
- https://arxiv.org/abs/2603.22489
