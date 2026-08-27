# Research — MCP Tool Argument Boundary Gate

**Topic:** Constrain LLM-controlled MCP tool arguments before command, network, or filesystem sinks  
**Category:** Security  
**Research date:** 2026-08-27 (UTC+7)

## Problem
MCP servers often expose powerful command, network, and filesystem operations. When an LLM can populate raw arguments, prompt-influenced values may reach shell execution, attacker-controlled endpoints, or filesystem paths without sink-specific validation.

## Why it matters now
Multiple 2026 advisories show distinct MCP servers failing at exactly this boundary: command arguments, outbound host/proxy selection, and path canonicalization.

## Affected users
MCP server authors, agent-platform builders, developers connecting third-party MCP servers, and teams allowing coding agents to read untrusted repositories or pages.

## Current public evidence

### Observed evidence
1. **CVE-2026-19334 / GHSA-pq7w-6xmw-3jgj**, published to the GitHub Advisory Database **2026-08-09**, reports command injection in NightTrek Ollama-mcp via `name`, `modelfile`, `source`, and `destination` arguments.  
   https://github.com/advisories/GHSA-pq7w-6xmw-3jgj
2. **CVE-2026-53957 / GHSA-2xhg-73j7-rrgx**, published to GitHub advisory listings **2026-08-19**, reports Contentful MCP `export_space`/`import_space` passing LLM-controlled `host`/`proxy` values to the client, enabling redirection of the server PAT toward an attacker endpoint.  
   https://github.com/contentful/contentful-mcp-server/security/advisories/GHSA-2xhg-73j7-rrgx
3. **CVE-2026-53766 / GHSA-8qf9-62x2-82pp**, updated in the GitHub Advisory Database **2026-08-17**, reports that chrome-devtools-mcp used textual `path.resolve()` checks instead of canonicalizing symlinks, allowing workspace-root bypass for read, write, and upload operations.  
   https://github.com/advisories/GHSA-8qf9-62x2-82pp

### Interpretation
The common root is not MCP itself but missing sink-aware validation between probabilistic tool-argument generation and deterministic side effects. A generic approval prompt or safe-tool label cannot prove that a particular host, path, or shell argument is safe.

## Existing approaches
- Tool allowlists and user approval.
- Input schemas and type validation.
- Workspace roots.
- Sandboxes, containers, and least-privilege credentials.
- Per-project patches such as canonical path checks or endpoint restrictions.

## Remaining limitations
- JSON schema validates shape, not shell metacharacter safety, endpoint trust, or canonical filesystem location.
- A tool can be globally allowed while a particular argument is dangerous.
- Lexical path validation can be defeated by symlinks.
- Approval UIs may not make endpoint or credential redirection obvious.
- Patches are often sink-specific and not reusable across MCP servers.

## Root-cause analysis
1. Tool authorization is applied at tool-name granularity instead of argument and sink granularity.
2. LLM-controlled strings are treated as ordinary application inputs near dangerous sinks.
3. Filesystem checks compare lexical paths instead of canonical targets.
4. Network clients accept caller-controlled hosts or proxies while automatically attaching credentials.
5. Shell or process APIs receive strings instead of structured argument vectors or strict validation.

## Improvement opportunity
Add a deterministic pre-tool-call boundary gate with fail-closed tool allowlisting, sink-specific field policies, shell metacharacter rejection where legacy string execution exists, host allowlists, proxy bans for credentialed calls, and canonical path checks before filesystem operations. Pair this with least privilege and patching; it is defense in depth, not a substitute for vendor fixes.

## Relevant sources
- GitHub Advisory GHSA-pq7w-6xmw-3jgj: https://github.com/advisories/GHSA-pq7w-6xmw-3jgj
- Contentful advisory GHSA-2xhg-73j7-rrgx: https://github.com/contentful/contentful-mcp-server/security/advisories/GHSA-2xhg-73j7-rrgx
- GitHub Advisory GHSA-8qf9-62x2-82pp: https://github.com/advisories/GHSA-8qf9-62x2-82pp
- NVD CVE-2026-53766: https://nvd.nist.gov/vuln/detail/CVE-2026-53766
