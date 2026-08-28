# Research — MCP Transport Resource Exhaustion Guard

**Topic:** MCP transport resource exhaustion  
**Category:** Security  
**Research date:** 2026-08-28 (UTC+7)

## Problem
MCP transports can accumulate attacker-controlled data or session state without finite bounds, allowing denial of service through memory exhaustion.

## Why it matters now
Two recent advisories in official MCP SDK ecosystems show the same root failure on opposite sides of the transport boundary: an MCP PHP client buffered an SSE stream without a cap, while the Ruby server transport retained initialized sessions indefinitely by default.

## Affected users
MCP client developers, remote MCP server operators, AI-platform teams, and developers connecting agents to third-party MCP endpoints.

## Current public evidence
### Observed evidence
1. **CVE-2026-53965 / GHSA-7m52-jw36-44r3**, published in August 2026, affects `mcp/sdk` PHP 0.5.0–0.7.0. The HTTP client appended SSE chunks to an in-memory buffer until a delimiter arrived, with no upper bound. A remote server could withhold the delimiter and exhaust memory. Fixed in 0.7.1.  
   GitHub advisory: https://github.com/modelcontextprotocol/php-sdk/security/advisories/GHSA-7m52-jw36-44r3  
   Release: https://github.com/modelcontextprotocol/php-sdk/releases/tag/v0.7.1
2. **GHSA-52jp-gj8w-j6xh**, published July 8, 2026, affects the MCP Ruby SDK. `StreamableHTTPTransport` could retain initialized sessions indefinitely when no idle timeout was configured, enabling memory exhaustion through repeated initialization. Fixed in 0.23.0.  
   GitHub advisory: https://github.com/modelcontextprotocol/ruby-sdk/security/advisories/GHSA-52jp-gj8w-j6xh
3. GitLab’s advisory database independently summarizes CVE-2026-53965 as a remote client-side DoS caused by the unbounded SSE buffer.  
   https://advisories.gitlab.io/composer/mcp/sdk/CVE-2026-53965/

### Interpretation
These are independent implementation failures with a shared engineering weakness: transport state was permitted to grow without a deterministic resource ceiling. A version upgrade fixes known defects, but teams still need a reusable control proving that effective runtime configuration remains bounded.

## Existing approaches
- Upgrade to patched SDK releases.
- Configure session idle timeouts where supported.
- Apply generic process/container memory limits.
- Restrict exposure and authenticate remote endpoints.

## Remaining limitations
- Process memory limits turn an unbounded-growth bug into a smaller crash rather than preventing the protocol abuse.
- SDK defaults and configuration knobs differ by language and version.
- Dependency scanners verify versions, not effective runtime limits.
- Operators often lack deterministic tests for missing delimiter, session flood, and slow-drip stream cases.

## Root-cause analysis
1. No explicit upper bound on attacker-influenced transport state.
2. Cleanup depended on cooperative peer behavior such as delimiters or DELETE requests.
3. Resource budgets were implicit rather than startup invariants.
4. Runtime observability did not directly map buffer/session growth to a blocking decision.

## Improvement opportunity
Define explicit finite budgets for stream buffers, active sessions, and session idle lifetime; validate them preflight; feed runtime measurements through a deterministic guard; and keep host/container limits as defense in depth rather than the primary control.

## Goal
Prevent remote peers from causing unbounded MCP transport memory growth.

## Metrics
Peak buffered bytes, active session count, maximum idle age, RSS growth, OOM/crash count, malicious-fixture block rate.

## Trigger
New/updated MCP HTTP transport, SDK upgrade, endpoint exposure change, or unexplained memory growth.

## Inputs
Transport role, endpoint exposure, active sessions, oldest idle age, buffered bytes, configured limits, dependency versions.

## Outputs
Evidence-backed remediation and deterministic allow/block decisions.

## Relevant sources
- https://github.com/modelcontextprotocol/php-sdk/security/advisories/GHSA-7m52-jw36-44r3
- https://github.com/modelcontextprotocol/php-sdk/releases/tag/v0.7.1
- https://github.com/modelcontextprotocol/ruby-sdk/security/advisories/GHSA-52jp-gj8w-j6xh
- https://advisories.gitlab.io/composer/mcp/sdk/CVE-2026-53965/
