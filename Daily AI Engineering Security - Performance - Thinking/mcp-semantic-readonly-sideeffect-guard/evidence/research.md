# Research

## Topic
Semantic read-only enforcement for MCP database tools

## Category
Security

## Problem
A tool can be named or configured as read-only while still accepting semantically write-capable operations.

## Why it matters now
On 2026-08-05 AWS disclosed CVE-2026-18954 in the Amazon DocumentDB MCP Server: versions before 1.0.12 allowed `$out` and `$merge` through the aggregate tool despite read-only mode. This is a fresh instance of a recurring control failure across MCP database servers.

## Affected users
Developers, agent-platform operators, database owners, and teams exposing MCP data tools to autonomous or prompt-influenced agents.

## Current public evidence
### Observed evidence
1. AWS Security Bulletin 2026-076-AWS and GHSA-j694-4m5j-w8hc: DocumentDB MCP Server `<1.0.12` allowed write-capable aggregation stages through read-only mode. AWS recommends upgrading and using a database user without write privileges. https://aws.amazon.com/security/security-bulletins/2026-076-aws/ ; https://github.com/awslabs/mcp/security/advisories/GHSA-j694-4m5j-w8hc
2. CVE-2025-59333 / GHSA-65hm-pwj5-73pw: ExecuteAutomation MCP database server used a `SELECT` prefix check, but SQL functions such as administrative procedures can have side effects. https://github.com/advisories/GHSA-65hm-pwj5-73pw
3. CVE-2026-35402: `mcp-neo4j-cypher` read-only enforcement could be bypassed using APOC `CALL` procedures. https://nvd.nist.gov/vuln/detail/CVE-2026-35402
4. CVE-2026-46519: Kubernetes MCP tool restrictions were enforced in discovery but not execution, demonstrating why presentation-layer filtering is not an authorization boundary. https://github.com/advisories/GHSA-cr22-wjx7-2w6m

### Interpretation
The recurring root problem is semantic mismatch: UI/tool labels and lexical classification are treated as authorization, while the underlying language or protocol contains alternate side-effect paths. Discovery filtering also does not prove call-time enforcement.

## Existing approaches
- Upgrade vulnerable MCP servers.
- Hide or disable explicitly named write tools.
- Lexical query checks and deny lists.
- Agent instructions telling the model not to mutate.
- Database credentials scoped to read-only permissions.

## Remaining limitations
Patches are server-specific; lexical filters are incomplete; model instructions are non-authoritative; and discovery-only restrictions can be bypassed by direct calls. Datastore credentials are strongest but are sometimes overprivileged for operational convenience.

## Root-cause analysis
1. Read-only is modeled as a tool-name property instead of an effect invariant.
2. Query languages expose side effects through read-like constructs.
3. Policy may run only during `tools/list`, not `tools/call`.
4. Backing credentials often have broader privileges than the MCP mode claims.
5. Negative security tests cover obvious write verbs but not semantic side effects.

## Improvement opportunity
Use defense in depth: effect-aware preflight, execution-time authorization, least-privilege datastore identity, deterministic negative fixtures, and fail-closed handling for unknown constructs.

## Relevant sources
- AWS bulletin, 2026-08-05: https://aws.amazon.com/security/security-bulletins/2026-076-aws/
- AWS GitHub advisory, 2026-08-05: https://github.com/awslabs/mcp/security/advisories/GHSA-j694-4m5j-w8hc
- NVD CVE-2026-18954: https://nvd.nist.gov/vuln/detail/CVE-2026-18954
- GitHub Advisory CVE-2025-59333: https://github.com/advisories/GHSA-65hm-pwj5-73pw
- NVD CVE-2026-35402: https://nvd.nist.gov/vuln/detail/CVE-2026-35402
- GitHub Advisory CVE-2026-46519: https://github.com/advisories/GHSA-cr22-wjx7-2w6m

## Goal, metrics, trigger, inputs, outputs
Goal: make declared read-only behavior equivalent to effective no-write capability. Metrics: negative-test pass rate, blocked semantic-write attempts, datastore-denied writes, false positives, drift findings. Trigger: new/changed MCP database tool, server upgrade, or policy change. Inputs: tool schemas, operation payloads, server policy, datastore grants. Outputs: effect classification, blocking result, evidence report, remediation decision.