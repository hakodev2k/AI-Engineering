# Research — MCP Outbound SSRF Credential Boundary
**Topic:** outbound SSRF and credential-bearing agent requests  
**Category:** Security  
**Research date:** 2026-08-27 (UTC+7)

## Problem
LLM-influenced URL parameters, redirects, or pagination links can make MCP/agent tools perform server-side requests to destinations that the user did not intend, including cloud metadata services or attacker-controlled hosts.

## Why it matters now
Multiple 2026 public reports show SSRF and credential disclosure in MCP-style tooling, while current security guidance explicitly requires network boundaries rather than relying solely on model behavior or approval prompts.

## Affected users
MCP server authors, cloud-hosted agent operators, coding-agent users, and platform teams exposing fetch/API tools with ambient credentials.

## Current public evidence
### Observed evidence
1. Model Context Protocol servers issue #4143, opened 2026-05-12, reports reference/community fetch servers accepting arbitrary URLs without scheme/host protections and describes cloud metadata credential exposure risk: https://github.com/modelcontextprotocol/servers/issues/4143
2. AWS CVE-2026-15643 bulletin, published 2026-07-14, documents SSRF in AWS HealthLake MCP Server before 0.0.14 through an unvalidated pagination URL, allowing temporary credential exfiltration to an arbitrary endpoint: https://aws.amazon.com/security/security-bulletins/2026-054-aws/
3. OWASP MCP Security Cheat Sheet states that MCP tool inputs can originate from LLM output influenced by malicious context and recommends strict allowlist validation to prevent SSRF to internal/cloud metadata endpoints: https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html
4. VS Code AI security guidance, updated 2026-08-26, recommends sandboxing and network-domain restrictions and warns that prompt injection/tool chaining can cause data exfiltration: https://code.visualstudio.com/docs/agents/run/security

### Interpretation
The common root cause is an authorization mismatch: the agent/tool possesses network and credential authority while destination strings remain attacker-influenced data. Approval UIs and read-only modes do not make arbitrary destinations safe.

## Existing approaches
Patch known vulnerable servers, least-privilege IAM, network sandboxing, domain approvals, URL allowlists, readonly modes, and human approval.

## Remaining limitations
- DNS can resolve apparently harmless hostnames to private/link-local ranges.
- Redirect targets may bypass validation performed only on the initial URL.
- Read-only application flags do not constrain stolen credential authority.
- Human approval can miss encoded or indirect destination changes.
- Broad network sandboxes can still permit attacker-controlled hosts inside allowed egress.

## Root-cause analysis
1. URL strings are trusted after superficial syntax validation.
2. Resolved IP classification is omitted.
3. Redirects are not revalidated.
4. Ambient credentials are attached before destination authorization.
5. Network policy and tool policy are enforced in different layers with gaps.

## Improvement opportunity
Use a deterministic pre-request and pre-redirect gate that validates scheme, hostname/domain allowlist, resolved IP class, port policy, and credential scope. Attach credentials only after the destination passes.

## Relevant sources
- https://github.com/modelcontextprotocol/servers/issues/4143
- https://aws.amazon.com/security/security-bulletins/2026-054-aws/
- https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html
- https://code.visualstudio.com/docs/agents/run/security
