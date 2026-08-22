# Research — MCP Tool Scope Capability Firewall

## Topic
MCP Tool Scope Capability Firewall

## Category
Security

## Problem
Agent tool calls can be syntactically valid and authorized by a broad credential while targeting a repository, branch, path, host, or resource that is outside the user's task intent. Indirect prompt injection increases the chance that untrusted content supplies such targets.

## Why it matters now
MCP adoption has expanded the number of powerful tools exposed directly to models. Current public reports specifically identify unconstrained target parameters in repository and filesystem MCP tools, while the protocol's security documentation emphasizes trust and authorization boundaries.

## Affected users
Developers connecting MCP servers, coding agents, enterprise agent platforms, repository automation, local filesystem agents, and operators issuing broad service credentials.

## Current public evidence
### Observed evidence
1. modelcontextprotocol/servers issue #3751, opened March 30, 2026, reports that the GitHub `push_files` tool accepts owner/repo/branch targets not tied to the intended user scope; under prompt injection this can direct writes to other repositories accessible to the credential. Source: https://github.com/modelcontextprotocol/servers/issues/3751
2. modelcontextprotocol/servers issue #3752, opened March 30, 2026, reports unbounded filesystem path parameters across filesystem tools and describes traversal/out-of-scope read/write risk when attacker-controlled instructions influence paths. Source: https://github.com/modelcontextprotocol/servers/issues/3752
3. MCP 2026-07-28 authorization security considerations describe confused-deputy risks and require careful consent/authorization boundaries for intermediaries. Source: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/security-considerations.mdx
4. MCP SECURITY.md states that clients trust configured servers and users/admins are responsible for server selection, reinforcing that the server connection itself is a trust boundary rather than proof that every generated action matches task intent. Source: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/SECURITY.md

### Interpretation
Credential authorization and model intent are separate layers. A deterministic host-side capability envelope can ensure that model-selected target parameters stay within the explicit scope of the task even when the credential is broader.

### Proposed solution
Normalize target attributes, resolve filesystem paths against configured roots, enforce repository/branch/host allowlists, classify operation risk, and require approval for designated high-impact operations. Fail closed for unknown tools or missing target attributes.

## Existing approaches
- broad OAuth/PAT/service credentials
- filesystem server roots
- prompt-level instructions such as “only edit this repository”
- human-in-the-loop confirmation
- service-side authorization/RBAC

## Remaining limitations
- RBAC may authorize many repositories/resources, broader than a task
- prompt constraints are not deterministic security controls
- lexical path prefix checks can be bypassed by `..`, case/platform quirks, or symlinks if canonicalization is incomplete
- approval prompts are weak if they do not display normalized target and operation
- allowlists become stale without ownership and tests

## Root-cause analysis
1. Authentication answers who the caller is, not which task-scoped targets the model may choose.
2. Tool schemas often validate type/shape, not semantic scope.
3. Agent hosts frequently delegate target selection entirely to the model.
4. Untrusted retrieved content and tool outputs share the model context with legitimate instructions.
5. Security policy is distributed across prompts, credentials, and application code rather than enforced at one deterministic invocation boundary.

## Improvement opportunity
Introduce a host-side policy gate between tool-call generation and execution. Keep the envelope narrow, explicit, machine-testable, logged, and immutable by the model.

## Goal
Block out-of-scope MCP actions while preserving valid in-scope operations.

## Metrics
Policy coverage, denied attack fixtures, false deny rate, high-impact approval coverage, cross-scope attempt count, unresolved unknown-tool count.

## Trigger
Every MCP invocation that can read/write external state or choose a resource target.

## Inputs
Tool name, operation class, normalized target attributes, static policy, approval evidence.

## Outputs
`allow`, `deny`, or `approval_required`, with normalized target and rule reason.

## Relevant sources
- https://github.com/modelcontextprotocol/servers/issues/3751
- https://github.com/modelcontextprotocol/servers/issues/3752
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/security-considerations.mdx
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/SECURITY.md
