# Research

## Topic
MCP Untrusted Instructions Boundary

## Category
Security

## Problem
Server-controlled MCP instructions can be injected into an LLM context with excessive trust, creating a path from an untrusted connector to model behavior and potentially to privileged tools.

## Why it matters now
The MCP specification and ecosystem continue to expand server-provided metadata. On 2026-08-07, issue #3213 in `modelcontextprotocol/modelcontextprotocol` documented and demonstrated a prompt-injection path through `server/discover` / legacy `initialize` instructions. OWASP's MCP Top 10 and MCP Tool Poisoning guidance independently describe tool poisoning and contextual payload prompt injection as real attack classes.

## Affected users
MCP client authors, agent platforms, enterprise gateways, developers connecting third-party MCP servers, and teams exposing high-impact tools to LLM agents.

## Current public evidence
### Observed evidence
1. `modelcontextprotocol/modelcontextprotocol#3213`, opened 2026-08-07, reports that server-controlled `instructions` can be returned without intrinsic sanitization/length restrictions and may be inserted into a system prompt by clients. The issue includes a PoC and recommends isolating the field as untrusted content, applying limits/detection, and avoiding verbatim privileged injection.
2. `modelcontextprotocol/modelcontextprotocol#3180`, opened 2026-07-31, reports a broader protocol-level trust gap: server-authored tool descriptions can influence the model as if they were instructions.
3. OWASP MCP Top 10 lists Tool Poisoning and Prompt Injection via Contextual Payloads, recommending least privilege, provenance, validation, isolation, and controls around tool execution.
4. OWASP's MCP Tool Poisoning attack page states that tool responses may carry hidden instructions into model context and emphasizes structured output validation plus backend access control rather than relying on system-prompt wording alone.

### Interpretation
The common failure is not merely “bad words in a prompt”; it is a privilege-boundary error. Natural-language content from a remote server is data from a different trust domain. If the client promotes that data into a host-controlled instruction channel, the model becomes the confused deputy between the untrusted server and privileged tools.

### Proposed solution
Create an explicit untrusted-server-content channel with provenance, deterministic pre-ingestion checks, length/control-character limits, risk scoring, and hard rules preventing server content from changing permissions, approval requirements, secrets policy, or host instructions. Enforce actual tool authorization outside the LLM.

## Existing approaches
Prompt-injection classifiers; keyword/pattern filters; XML/tag delimiters; content sanitization; structured schemas; server allowlists; MCP scanners; least-privilege credentials; per-tool allow/ask/deny; human approval; sandboxing.

## Remaining limitations
Natural-language injection detection has false negatives and false positives. Tagging content does not create a security boundary by itself. A trusted server can later be compromised. Allowlisting at connect time does not validate runtime changes. Model-level “ignore malicious instructions” language is not an authorization mechanism.

## Root-cause analysis
- Mixed-trust text is merged into a high-authority prompt region.
- Provenance is lost after concatenation.
- Agent tool permissions are broader than the data source needs.
- Runtime metadata changes are not re-evaluated.
- Detection logic is mistaken for enforcement.

## Improvement opportunity
Make trust classification, provenance, maximum size, destination context class, and permission invariants machine-checkable before any server text enters model context. Add regression fixtures for direct override language, data-exfiltration requests, approval bypass, encoded/control-character payloads, and benign guidance.

## Relevant sources
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3180
- https://owasp.org/www-project-mcp-top-10/
- https://owasp.org/www-community/attacks/MCP_Tool_Poisoning
- https://github.com/OWASP/AISVS/blob/main/1.0/research/chapters/C02-User-Input-Validation/C02-01-Prompt-Injection-Defense.md
