# Research — MCP Untrusted Server Instructions Quarantine

**Category:** Security  
**Research date:** 2026-08-26 (UTC+7)

## Topic
MCP server-controlled natural-language instructions can cross a trust boundary into agent prompts and influence tool use.

## Problem
An MCP client may treat server-supplied descriptive text as trusted operating instructions. A malicious or compromised server can therefore inject directives into model context, and cache/intermediary behavior can amplify exposure.

## Why it matters now
A public MCP specification issue opened August 7, 2026 describes `server/discover` and `initialize` `instructions` as server-controlled prompt-injection surfaces, including a cache-poisoning chain when public caching is involved. Microsoft/VS Code security guidance updated in 2026 explicitly treats tool outputs and MCP-fetched content as untrusted prompt-injection surfaces. AWS disclosed CVE-2026-18655 on August 3, 2026, where prompt-influenced MCP tool arguments could disclose broker credentials or OAuth tokens to a crafted endpoint.

## Affected users
MCP client authors, agent-platform teams, developers connecting third-party MCP servers, and operators using auto-approved tools.

## Current public evidence
### Observed evidence
1. MCP issue #3213, opened August 7, 2026: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
2. Microsoft VS Code AI security guidance: https://github.com/microsoft/vscode-docs/blob/main/docs/agents/run/security.md
3. AWS CVE-2026-18655 bulletin, August 3, 2026: https://aws.amazon.com/security/security-bulletins/2026-070-aws/

### Interpretation
The recurring failure is a missing executable trust-boundary contract between server metadata and privileged model/tool-control context. String filtering alone cannot prove safety.

## Existing approaches
Prompt-injection detection, human approval, sandboxes, endpoint allowlists, least-privilege tool exposure.

## Remaining limitations
Heuristics have false negatives; approval prompts often hide authorship; allowlists do not stop manipulation among still-allowed tools; shared caches can widen blast radius; clients often lose prompt-segment provenance.

## Root-cause analysis
Natural-language metadata and control instructions share a model channel; provenance is lost during assembly; cache scope differs from trust scope; tool authorization may occur without provenance binding; scanners are over-relied on.

## Improvement opportunity
Preserve provenance, cap untrusted instruction size, forbid public caching, block known override patterns, and require explicit policy approval before quarantined text may influence privileged tool decisions. Never splice server instructions into trusted policy.

## Trigger
New/changed MCP server, discovery response, initialization response, or cache-policy change.

## Inputs
Server identity, origin, instruction text, requested tools, cache scope, authorization context.

## Outputs
Data-only envelope or quarantine decision with machine-readable reasons.

## Metrics
Attack-fixture block rate, public-cache violations, privileged-tool approval coverage, false-positive review count.

## Relevant sources
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
- https://github.com/microsoft/vscode-docs/blob/main/docs/agents/run/security.md
- https://aws.amazon.com/security/security-bulletins/2026-070-aws/
