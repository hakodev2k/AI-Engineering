# Research — MCP Tool Metadata Drift Guard

## Topic
MCP Tool Metadata Drift Guard

## Category
Security

## Problem
An MCP server can change a tool definition, description, schema, or risk annotation after initial review/approval. Because models consume tool metadata as context, a changed description can introduce new instructions or risk semantics without a fresh trust decision.

## Why it matters now
The MCP ecosystem is actively discussing signed manifests and tool-annotation trust. Current official guidance says annotations are hints, not enforcement, and untrusted servers may lie. A June 2026 MCP discussion explicitly identifies post-approval tool-description changes as a rug-pull gap.

## Affected users
MCP client/host developers, enterprise agent platforms, developers installing third-party MCP servers, and security teams operating tool gateways.

## Current public evidence
### Observed evidence
- MCP discussion #2913 (2026-06-14) proposes signed tool manifests specifically to detect tool poisoning / rug pulls where tool descriptions change after approval: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2913
- Official MCP Tool Annotations blog (2026-03-16) states annotations are untrusted hints, can be false, and are not enforcement: https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/
- OWASP MCP Top 10 MCP03 describes tool-poisoning indicators in names, descriptions, and parameter descriptions and recommends static analysis before trusting tools: https://github.com/OWASP/www-project-mcp-top-10/blob/main/2025/MCP03-2025%E2%80%93Tool-Poisoning.md
- MCP security guidance documents that clients trust configured MCP servers and local servers like installed software, making server selection/configuration a critical trust boundary: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/SECURITY.md

### Interpretation
Admission-time review is insufficient when metadata can change later. Signed manifests are promising but not universally deployed, and signatures prove integrity/identity rather than behavioral truth. Clients can immediately add local pinning and drift detection as a deterministic guard.

## Existing approaches
- Manual review at installation time.
- Static scanning of tool definitions.
- MCP annotations such as `readOnlyHint` and `destructiveHint`.
- Network/sandbox controls.
- Proposed signed tool manifests.

## Remaining limitations
Annotations are hints. Static scanning can miss later changes. A signature does not prove runtime behavior is honest. Many clients lack a durable approved-manifest snapshot and change-review workflow.

## Root-cause analysis
1. Tool metadata is often treated as current truth rather than versioned security-relevant input.
2. Approval decisions are not cryptographically or locally bound to the exact tool definition.
3. Description/schema/annotation changes do not always trigger re-approval.
4. Canonicalization differs across clients, making stable comparison hard.
5. Soft annotations are sometimes used like contracts.

## Improvement opportunity
Create a local manifest pinning gate: canonicalize security-relevant tool metadata, hash it at approval, compare on every reconnect/discovery refresh, classify drift, and block changed tools until explicit re-review. If trusted signatures exist, verify them as an additional signal, not a replacement for policy enforcement.

## Goal and metrics
- 100% detection of changed name/description/input schema/risk annotations in fixtures.
- 0 silent execution of drifted tools.
- 100% approval binding to exact manifest digest for high-impact tools.
- 0 false drift on semantically identical JSON key ordering.

## Trigger / Inputs / Outputs
Trigger: MCP server connect/reconnect, `tools/list` refresh, or pre-call check. Inputs: server identity, tool metadata, approved snapshot, trust policy. Outputs: allow/review-required/deny plus digest and diff evidence.
