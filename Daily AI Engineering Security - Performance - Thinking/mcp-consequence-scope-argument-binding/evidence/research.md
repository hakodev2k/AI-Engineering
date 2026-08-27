# Research — MCP Consequence-Scope Argument Binding

**Topic:** Bind high-consequence MCP tool arguments to an approved resource scope instead of trusting model-selected strings.

**Category:** Security

**Research date:** 2026-08-28 (UTC+7)

## Problem
MCP tools can expose powerful write/read primitives whose target parameters (`owner`, `repo`, `branch`, filesystem path, URL/endpoint) are unconstrained strings. Under indirect prompt injection or compromised context, an agent can select an attacker-chosen target even though the tool invocation itself is technically authorized.

## Why it matters now
Recent public reports show this exact class of failure across repository, filesystem, browser, and credential-bearing MCP tools. The current MCP risk vocabulary helps classify tools but does not itself bind runtime arguments to an approved target set.

## Affected users
AI coding-agent users, platform builders, MCP client authors, teams granting repository/filesystem/network tools, and operators relying on human approval for sensitive tool calls.

## Current public evidence
### Observed evidence
1. `modelcontextprotocol/servers` issue #3751 (2026-03-30) reports `push_files` accepting arbitrary `owner`, `repo`, and `branch` values; under prompt injection an LLM can direct writes to a different repository available to the credential: https://github.com/modelcontextprotocol/servers/issues/3751
2. `modelcontextprotocol/servers` issue #3752 (2026-03-30) reports filesystem tool path parameters lacking schema-level traversal constraints, enabling prompt-influenced reads/writes outside the intended working directory: https://github.com/modelcontextprotocol/servers/issues/3752
3. AWS security bulletin CVE-2026-18655 (2026-08-03) documents an MCP-server path where prompt-influenced connection arguments could disclose broker credentials/OAuth tokens to an attacker-controlled endpoint; AWS recommends avoiding auto-approval of affected connection tools until patched: https://aws.amazon.com/security/security-bulletins/2026-070-aws/
4. MCP's 2026-03-16 tool-annotation guidance says `readOnlyHint`, `destructiveHint`, `idempotentHint`, and `openWorldHint` are risk hints; annotations are optional and clients vary in enforcement: https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/

### Interpretation
The common root problem is authorization without consequence-scope binding: possession of a tool/token answers *whether* an action may be attempted but not *where* or *which resource* the model may target for this task. Prompt scanners and confirmation dialogs cannot reliably repair that missing deterministic boundary.

## Existing approaches
Least-privilege credentials, MCP tool annotations, sandbox/workspace roots, endpoint allowlists, prompt-injection scanning, and human approval before destructive/open-world calls.

## Remaining limitations
- Tool annotations classify risk but do not constrain concrete argument values.
- Broad credentials may cover many repos, paths, branches, or endpoints.
- Human approval can be ambiguous if the UI does not display normalized targets and scope differences.
- String prefix checks are vulnerable to path normalization/symlink or URL-host confusion.
- Prompt-injection detectors are probabilistic and may miss semantically equivalent instructions.

## Root-cause analysis
1. Identity/credential scope is broader than task scope.
2. Tool schemas permit unconstrained target parameters.
3. Authorization is often decided before argument normalization.
4. Approval is not cryptographically/deterministically bound to the exact normalized target tuple.
5. Clients rely on model intent instead of a separate policy decision point.

## Improvement opportunity
Insert a deterministic pre-tool-call guard that normalizes repository, filesystem, and network targets; compares them to an explicit task-scoped allowlist; requires human approval for configured high-consequence operations; and emits auditable reason codes without secrets.

## Relevant sources
- https://github.com/modelcontextprotocol/servers/issues/3751
- https://github.com/modelcontextprotocol/servers/issues/3752
- https://aws.amazon.com/security/security-bulletins/2026-070-aws/
- https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/
