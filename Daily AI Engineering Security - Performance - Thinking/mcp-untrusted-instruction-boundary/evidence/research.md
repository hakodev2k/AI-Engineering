# Research — MCP Untrusted Instruction Boundary

## Topic
MCP Untrusted Instruction Boundary

## Category
Security

## Problem
MCP server-controlled natural-language fields such as server instructions and tool/parameter descriptions may be inserted into an LLM context as if they were trusted operational guidance. A malicious or compromised server can therefore influence model behavior before any tool is invoked.

## Why it matters now
On 2026-08-07, MCP issue #3213 described `server/discover` and `initialize` instruction fields as a prompt-injection surface, including a cross-user cache-poisoning amplification path. Earlier 2026 disclosures also documented tool-description injection and tool-name collision/hijacking patterns.

## Affected users
MCP client authors, agent platform builders, developers installing third-party MCP servers, and teams operating shared MCP gateways.

## Current public evidence
### Observed evidence
1. MCP issue #3213, opened 2026-08-07, reports server-controlled `instructions` reaching model context without a trust boundary or length limit and proposes treating it as untrusted content: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
2. MCP discussion #2457 discusses client-side tool-description substitution to defend against indirect prompt injection in tool schema descriptions: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2457
3. WeKnora advisory GHSA-67q9-58vj-32qx documents tool execution hijacking via ambiguous MCP tool naming combined with indirect prompt injection; patched in 0.3.0: https://github.com/Tencent/WeKnora/security/advisories/GHSA-67q9-58vj-32qx
4. MCP authorization specification 2026-07-28 requires audience-bound access tokens, prohibits token forwarding, and specifies runtime scope challenges, showing that identity and permission boundaries must remain independent of model-provided instructions: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/index.mdx

### Interpretation
Protocol metadata is necessary for tool usability, but natural-language metadata should not inherit system-level authority. Sanitization alone cannot establish trust because semantically malicious instructions can be ordinary text.

## Existing approaches
- Prompt-injection classifiers or keyword filters.
- Delimiters around server-provided content.
- Manual allowlists of MCP servers.
- OAuth scopes and per-server credentials.
- Tool-name namespacing.

## Remaining limitations
- Delimiters do not mechanically prevent an LLM from following embedded imperatives.
- Keyword filters have false negatives and false positives.
- A trusted server can later be compromised or change metadata.
- Authorization limits credential use but does not stop the model from being manipulated into selecting an allowed but harmful tool.

## Root-cause analysis
1. Provenance is lost when remote metadata is concatenated into trusted prompt layers.
2. Clients often lack explicit authority labels for context segments.
3. Tool identity and schema changes are not always pinned or reviewed.
4. Model-side interpretation is used where deterministic policy should gate capability.

## Improvement opportunity
Introduce a client-side provenance gate: canonicalize remote metadata, label it untrusted, enforce size/control-character limits, detect imperative patterns for review, pin tool identity/schema fingerprints, and keep capability/approval decisions in deterministic policy outside the model.

## Goal and metrics
- 100% of remote MCP metadata carries provenance and trust level.
- 100% of tool schema/name changes detected before use.
- Known malicious instruction fixtures blocked or quarantined.
- No credential scope expansion caused solely by remote text.
- Zero secrets written to logs.

## Trigger / Inputs / Outputs
- Trigger: MCP discovery/initialize, tool-list refresh, or schema change.
- Inputs: server identity, instructions, tool names/descriptions/schema, configured trust policy.
- Outputs: allow/quarantine/block decision, fingerprints, findings, approval requirement.

## Relevant sources
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
- https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2457
- https://github.com/Tencent/WeKnora/security/advisories/GHSA-67q9-58vj-32qx
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/index.mdx
