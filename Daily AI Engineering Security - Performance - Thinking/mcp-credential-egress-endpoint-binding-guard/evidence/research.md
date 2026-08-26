# Research — MCP Credential Egress Endpoint Binding Guard

**Category:** Security  
**Research date:** 2026-08-26 (UTC+7)

## Topic
Prevent prompt-influenced MCP/tool arguments from redirecting credentials or sensitive data to attacker-controlled destinations.

## Problem
Agent tools often accept model-controlled hostnames, URLs, repository targets, file paths, or recipients while also having access to credentials or sensitive context. Prompt injection can steer a legitimate tool toward an attacker-selected sink even when the tool itself is approved.

## Why it matters now
AWS published CVE-2026-18655 on August 3, 2026 for the Amazon MQ MCP Server: prompt-influenced broker hostnames could cause broker credentials or OAuth tokens to be sent to a crafted endpoint. Microsoft’s 2026 agent security guidance separately emphasizes that prompt injection becomes concrete exfiltration/RCE when model-controlled tool parameters are not constrained. Microsoft’s July 2026 runtime-protection preview inspects prompts, pre-tool calls and tool responses precisely because tools can act on untrusted content.

## Affected users
MCP server authors, agent-platform teams, DevOps/coding-agent users, tool/plugin developers, and operators granting agents network or credential-bearing actions.

## Current public evidence
### Observed evidence
1. AWS security bulletin CVE-2026-18655 (published 2026-08-03) states that Amazon MQ MCP Server versions <=2.0.23 could disclose RabbitMQ credentials or OAuth tokens to a crafted endpoint controlled through `broker_hostname`; AWS patched 2.0.24 and advised disabling auto-approval for affected connection tools until patched: https://aws.amazon.com/security/security-bulletins/2026-070-aws/
2. Microsoft Security’s May 7, 2026 research on Semantic Kernel shows prompt injection crossing into arbitrary file read/write and RCE where model-controlled tool parameters lacked path restrictions, concluding that model-influenced tool parameters must be treated as attacker-controlled: https://www.microsoft.com/en-us/security/blog/2026/05/07/prompts-become-shells-rce-vulnerabilities-ai-agent-frameworks/
3. Microsoft Defender for Endpoint AI-agent runtime protection documentation, published July 2026, describes inline inspection of user prompts, pre-tool calls and tool responses to detect prompt injection and block high-risk actions before execution: https://learn.microsoft.com/en-us/defender-endpoint/ai-agent-runtime-protection-overview
4. OWASP AI Agent Security Cheat Sheet recommends repeatable adversarial tests for prompt override, unauthorized tool use, privilege escalation and data exfiltration through tool calls: https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html

### Interpretation
The security boundary must be enforced at the sink, not delegated to the model. Approval of a tool name is insufficient if sensitive arguments and destinations remain model-controlled. The recurring weakness is missing binding between credential identity, permitted destination, operation class and approval.

## Existing approaches
- Patch known vulnerable servers.
- Human approval of tool calls.
- Tool allowlists.
- Prompt-injection scanners.
- Network egress filtering.
- Secret masking and short-lived credentials.

## Remaining limitations
- Humans may approve plausible but malicious hostnames.
- Tool allowlists do not constrain dangerous argument combinations.
- Prompt scanners are heuristic and can miss indirect instructions.
- Generic network egress rules may be too coarse to express credential-to-destination binding.
- Short-lived tokens are still valuable during their lifetime.

## Root-cause analysis
1. Destination parameters are treated as normal model output instead of security-sensitive inputs.
2. Credential scope and destination scope are authorized independently.
3. Tool-level approval substitutes for argument-level validation.
4. Sensitive data can cross from private sources into public/untrusted sinks without deterministic information-flow checks.
5. Tests often validate successful calls but not hostile destination substitutions.

## Improvement opportunity
Add a deterministic pre-tool guard that binds each credential/sensitive-data class to approved endpoint patterns, ports, schemes and tool operations. Reject IP literals, userinfo URLs, non-TLS endpoints, unexpected ports, unapproved domains and mismatched credential classes. Require explicit human approval for policy exceptions and log only redacted decision metadata.

## Relevant sources
- https://aws.amazon.com/security/security-bulletins/2026-070-aws/
- https://www.microsoft.com/en-us/security/blog/2026/05/07/prompts-become-shells-rce-vulnerabilities-ai-agent-frameworks/
- https://learn.microsoft.com/en-us/defender-endpoint/ai-agent-runtime-protection-overview
- https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html
