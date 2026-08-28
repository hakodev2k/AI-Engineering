# Research: MCP Read-Only Content Privilege Escalation Guard

**Topic:** Read-only MCP content can trigger privileged actions in connected coding agents.  
**Category:** Security  
**Research date:** 2026-08-28 (UTC+7)

## Problem
A documentation or analytics MCP server may expose only read-only tools, yet the text it returns can be interpreted by a connected coding agent that has shell, filesystem, network, Git, or deployment privileges. The server's own permission model therefore does not bound impact.

## Why it matters now
CVE-2026-75130 was published August 18, 2026 for Context7 through 2.1.2. Public vulnerability records describe unsanitized Custom AI Instructions delivered by Context7's MCP server that can manipulate connected coding agents into credential exfiltration and destructive file operations. The important architectural failure is cross-component privilege amplification: the content source is read-only, but the consuming agent is not.

This is corroborated by recent research across multiple coding agents and MCP clients showing that malicious issue/tool content can penetrate agent guardrails and result in privileged execution.

## Affected users
Developers using MCP-connected coding assistants, platform teams enabling third-party documentation/search/analytics tools, security teams reviewing agent permissions, and vendors building MCP clients.

## Current public evidence
### Observed evidence
1. CVE-2026-75130, published August 18, 2026, describes prompt injection through Context7's Custom AI Instructions feature affecting versions through 2.1.2, with reported impacts including credential exfiltration and destructive file deletion by connected coding agents.  
   https://nvd.nist.gov/vuln/detail/CVE-2026-75130
2. SentinelOne's vulnerability record, published August 21, 2026, describes the same trust-boundary failure and explicitly notes that impact scales with the coding agent's local permissions.  
   https://www.sentinelone.com/vulnerability-database/cve-2026-75130/
3. *IssueTrojanBench* (July 2026) evaluates malicious issue content against Cursor, Claude Code, and Codex Desktop and reports 66.5% of malicious issues penetrating all evaluated guardrails, with agent-level defenses adding limited protection in the tested settings.  
   https://arxiv.org/abs/2607.20759
4. *Are AI-assisted Development Tools Immune to Prompt Injection?* (March 2026) evaluates seven MCP clients and reports substantial variation in static validation, parameter visibility, injection detection, sandboxing, warnings, and audit logging.  
   https://arxiv.org/abs/2603.21642

### Interpretation
The fundamental problem is not just missing string sanitization. It is a confused-deputy boundary: untrusted content from a low-privilege source can influence a higher-privilege agent. If authorization is implicit in model interpretation, the effective permissions are those of the consumer, not the source.

## Existing approaches
- Server-side sanitization of user-contributed content.
- Prompt-injection classifiers and regex filters.
- MCP tool allowlists.
- Agent sandboxing.
- Human approvals for sensitive tools.
- Workspace trust and network restrictions.
- Read-only MCP server design.

## Remaining limitations
- Read-only server permissions do not prevent the connected agent from acting.
- Sanitization is source-specific and may regress or miss semantically equivalent injections.
- Classifiers and regex filters are probabilistic/syntactic rather than authorization controls.
- Tool allowlists still permit dangerous combinations if untrusted content can influence arguments.
- Approval prompts may omit content provenance, producing approval fatigue or confused consent.
- Clients frequently flatten trusted policy and untrusted retrieved content into one model context.

## Root-cause analysis
1. Content provenance is lost during prompt assembly.
2. Authorization decisions are delegated to a probabilistic model.
3. The source's authority is not propagated to downstream tool calls.
4. Privilege crossing is not represented as an explicit event.
5. Human approval is not always bound to the exact untrusted input and requested action.
6. Security review focuses on what an MCP server can execute rather than what its output can cause a consumer to execute.

## Improvement opportunity
Introduce a deterministic provenance-aware gate between MCP content and privileged tool execution. Label third-party content as untrusted, hash it for auditability, prevent it from authorizing tools, require trusted policy plus explicit human approval for untrusted-to-privileged crossings, and quarantine suspicious or oversized content.

## Problem definition
- **Goal:** prevent low-authority MCP content from implicitly escalating into privileged coding-agent actions.
- **Trigger:** MCP/tool/resource content is consumed before a privileged tool call.
- **Inputs:** origin, content, requested tools, authorization source, human approval.
- **Outputs:** allow-data-only/quarantine decision, provenance, digest, reason codes.
- **Metrics:** privilege-crossing blocks, suspicious-content rate, approval coverage, attack-fixture block rate, false-positive review count, secret-exposure count.

## Relevant sources
- https://nvd.nist.gov/vuln/detail/CVE-2026-75130
- https://www.sentinelone.com/vulnerability-database/cve-2026-75130/
- https://arxiv.org/abs/2607.20759
- https://arxiv.org/abs/2603.21642
