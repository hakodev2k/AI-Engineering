# Research — MCP Untrusted Content Firewall

## Topic
MCP Untrusted Content Firewall

## Category
Security

## Problem
AI coding agents increasingly consume tool descriptions, tool outputs, fetched pages, repository issues, and embedded resources that may contain instructions written by an untrusted party. If that content is passed into the model without explicit provenance and a separate policy gate, the model can treat data as instructions and chain the result into a higher-impact tool call.

## Why it matters now
The MCP 2026-07-28 tools specification explicitly states that tools are model-controlled, recommends a human-in-the-loop for tool invocations, requires clients to treat tool annotations as untrusted unless they come from trusted servers, and recommends validating tool results before passing them to an LLM. VS Code's July 2026 agent-security documentation separately warns that tool outputs and fetched content can carry prompt-injection instructions, contaminate context, and influence later tool calls. These controls are useful, but real deployments often combine many servers, broad approvals, remote content, and autonomous loops, creating room for trust-boundary mistakes.

## Affected users
- Developers using coding agents with MCP servers or web/repository tools.
- Teams enabling auto-approval, Bypass Approvals, Autopilot, or equivalent agent modes.
- Platform builders aggregating tools from multiple servers.
- Security teams reviewing agentic workflows that can write files, run commands, call APIs, or access secrets.

## Current public evidence

### Observed evidence
1. The official MCP 2026-07-28 tools specification says tools are model-controlled; applications should keep a human able to deny tool invocations; tool annotations are untrusted unless they originate from trusted servers; and clients should validate tool results before handing them to an LLM. It also notes that clients aggregating servers can encounter tool-name collisions and should disambiguate them.
2. Microsoft's July 29, 2026 VS Code agent-security documentation describes prompt injection through MCP/fetch outputs, context contamination, tool-output chaining, and data exfiltration. It states that auto-approval and model-based assisted permissions are not security boundaries and recommends sandboxing plus scoped approvals.
3. Microsoft's approvals documentation explains separate pre-approval and post-approval for external content so users can review fetched/tool output before it enters model context, specifically because responses may contain prompt-injection attempts.
4. A July 31, 2026 community security review filed against the MCP specification raised tool-description and prompt-template provenance concerns. The issue was closed, so it is treated here as an ecosystem signal rather than an accepted protocol vulnerability.

### Interpretation
The recurring engineering gap is not simply “MCP is insecure.” The stronger, supported claim is that agent hosts need an explicit content trust boundary between external tool data and privileged agent actions. Approval dialogs and sandboxing reduce impact, but do not provide a reusable, deterministic provenance/risk gate that can be applied consistently across different hosts, MCP servers, fetched content, and autonomous workflows.

### Proposed solution
A reusable host-side content firewall that:
- tags every external payload with source/provenance metadata;
- detects instruction-like and exfiltration-like patterns deterministically;
- assigns a risk score using configurable rules;
- blocks automatic propagation of high-risk content into privileged actions;
- requires explicit approval for risky follow-on tool calls;
- emits structured audit evidence and metrics;
- never treats its detector as a perfect prompt-injection classifier.

## Existing approaches
- Human confirmation before sensitive tool calls.
- Session/workspace/user scoped tool approvals.
- Post-approval before external content is added to model context.
- Agent/MCP sandboxing and network restrictions.
- Workspace trust and curated MCP registries.
- Input/output schema validation.

## Remaining limitations
- Approval scope can be widened for convenience and then persist longer than intended.
- Users may not notice that a trusted domain contains untrusted user-generated content.
- Sandboxing constrains effects but does not classify data-vs-instruction semantics.
- Schema-valid output can still contain malicious natural-language instructions.
- Model-based risk judges can make mistakes and are not a hard security boundary.
- Cross-tool chains can move tainted content from a read-only tool into a later write/execute tool.
- Different hosts expose different approval and provenance semantics, making policy inconsistent.

## Root-cause analysis
1. **Data/instruction ambiguity:** LLMs operate on a unified context where untrusted text can resemble valid instructions.
2. **Provenance loss:** tool output often loses enough source metadata that downstream policy cannot reason about origin.
3. **Privilege mismatch:** low-trust read operations may feed high-impact write/execute operations.
4. **Approval fatigue:** repeated prompts encourage broad auto-approval.
5. **Non-deterministic protection:** relying only on model judgment makes enforcement difficult to audit or test.
6. **Insufficient chaining controls:** policies frequently validate individual calls but not taint propagation across a workflow.

## Improvement opportunity
Add a deterministic, host-agnostic policy layer in front of model context ingestion and before privileged tool execution. The layer should not try to “solve prompt injection” with a regex. Instead, it should preserve provenance, mark suspicious instruction-like content, enforce trust-to-privilege transitions, require review for high-risk chains, and provide testable evidence.

## Metrics
- Percentage of external payloads carrying provenance metadata.
- Number and rate of high-risk content events.
- Number of privileged follow-on calls blocked or escalated.
- False-positive rate on a maintained benign corpus.
- False-negative rate on a maintained adversarial corpus.
- Percentage of risky chains requiring explicit approval.
- Audit coverage: tool results with recorded source, risk score, and policy decision.

## Relevant sources
- MCP Tools specification 2026-07-28: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx
- MCP Security Best Practices 2026-07-28: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/docs/2026-07-28/tutorials/security/security_best_practices.mdx
- VS Code agent security, approved 2026-07-29: https://github.com/microsoft/vscode-docs/blob/main/docs/agents/security.md
- VS Code approvals and permissions, approved 2026-07-29: https://github.com/microsoft/vscode-docs/blob/main/docs/agents/approvals.md
- MCP specification security-review issue #3180, opened 2026-07-31: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3180

## Evidence status
- Implemented: not claimed by this research file.
- Measured: requires project-specific baseline and corpus tests.
- Verified: only after the package tests and target-host integration checks pass.
