# Research — MCP Schema Preflight Timeout Guard

## Topic
MCP Schema Preflight Timeout Guard

## Category
Performance

## Problem
Malformed or schema-invalid MCP tool arguments can still be dispatched to tool servers, where they may fail slowly, hang for long client timeouts, or trigger repeated retries. The result is wasted wall-clock time, token usage, and poor recovery behavior.

## Why it matters now
Recent 2026 reports show this failure mode across agent runtimes and MCP integrations. A Hermes Agent issue from 2026-08-04 reports malformed MCP parameters waiting for the full ~420-second timeout because client-side validation only parses JSON. Another Hermes issue from 2026-07-28 reports that deferred/progressively-disclosed tools lose provider-native schema validation and only check top-level required keys. VS Code Copilot and Claude Code users have separately reported missing or inconsistently enforced per-tool timeouts for hanging MCP calls.

## Affected users
AI-agent users, MCP client/runtime maintainers, developers using progressive tool disclosure, platform teams exposing long-running tools, and teams operating unattended agent jobs.

## Current public evidence
### Observed evidence
1. Hermes Agent issue #78260 (opened 2026-08-04) documents malformed parameters reaching MCP dispatch and causing full-timeout hangs, citing lack of client-side JSON Schema validation and a 420-second default timeout: https://github.com/NousResearch/hermes-agent/issues/78260
2. Hermes Agent issue #73175 (opened 2026-07-28) documents incomplete deferred-tool validation: top-level required fields are checked, but type, enum, nested required, and additionalProperties constraints can still pass through: https://github.com/NousResearch/hermes-agent/issues/73175
3. MCP 2026-07-28 tools specification distinguishes malformed requests and input-validation errors, and expects clients/servers to surface actionable failures instead of silently hanging: https://modelcontextprotocol.io/specification/2026-07-28/server/tools
4. VS Code Copilot issue #14130 requests configurable MCP tool timeouts because hanging tools can block agent execution indefinitely: https://github.com/microsoft/vscode-copilot-release/issues/14130
5. Claude Code issue #53641 reports per-server timeout configuration not being enforced for individual stdio MCP tool calls, with hangs exceeding ten minutes: https://github.com/anthropics/claude-code/issues/53641
6. GitHub's MCP debugging guidance recommends valid inputSchema definitions, explicit timeout handling, progress logging, and async/streaming approaches for long-running tools: https://docs.github.com/en/copilot/how-tos/copilot-sdk/troubleshooting/mcp-debugging

## Existing approaches
- Rely on provider-native function/tool schema validation.
- Parse JSON and dispatch if syntactically valid.
- Validate only required top-level keys.
- Increase the MCP timeout for slow tools.
- Let the server validate and return an error.
- Retry failed tool calls in the agent loop.

## Remaining limitations
Provider-native validation disappears when runtimes wrap many tools behind generic dispatch bridges. JSON parsing does not verify schema semantics. Required-only validation misses nested/type/enum/additional-property failures. Increasing timeouts helps legitimate long-running tools but worsens malformed-call latency. Server-only validation is too late when a server blocks before producing a clean error. Generic retries can repeat deterministic invalid calls.

## Root-cause analysis
- Concrete tool schemas are sometimes hidden from provider-native tool validation by progressive-disclosure bridges.
- Runtime preflight logic often validates syntax but not the full available JSON Schema.
- Timeout policy is static rather than failure-class-aware.
- Deterministic schema failures are not always classified as non-retryable until repaired.
- Agent loops may lack a per-tool failure budget or identical-argument circuit breaker.

## Improvement opportunity
Add a deterministic client-side preflight layer before dispatch. It should parse and normalize arguments, validate them against the concrete tool schema, return precise JSON-pointer-like failure paths to the model, avoid dispatch for deterministic invalid input, apply per-tool timeout budgets only after validation, and stop identical invalid retries after a bounded count.

## Goal
Reduce time-to-recovery and wasted calls caused by malformed MCP tool arguments without breaking valid long-running tools.

## Metrics
- Invalid calls blocked before dispatch.
- p50/p95 invalid-call failure latency.
- MCP dispatch count per failed task.
- Identical-invalid retry count.
- Tool timeout rate.
- Successful repair rate after validation feedback.
- Valid-call false-rejection rate.

## Trigger
Immediately before every MCP tool dispatch, including deferred/generic bridge dispatch.

## Inputs
Tool name, concrete JSON Schema, candidate arguments, timeout policy, prior failure fingerprints, and optional coercion policy.

## Outputs
`allow`, `repair_required`, `schema_unavailable`, or `block_retry` decision; normalized arguments; precise validation errors; timeout budget; failure fingerprint.

## Interpretation
The evidence supports a recurring integration gap, not a claim that MCP itself requires long hangs. The common failure is runtime-side: schema information exists but is not consistently enforced before dispatch, while timeout handling is too coarse to compensate safely.

## Proposed solution
A reusable schema-preflight and retry-budget package that makes deterministic validation failures cheap, observable, and repairable before a remote or subprocess tool call begins.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/78260
- https://github.com/NousResearch/hermes-agent/issues/73175
- https://modelcontextprotocol.io/specification/2026-07-28/server/tools
- https://github.com/microsoft/vscode-copilot-release/issues/14130
- https://github.com/anthropics/claude-code/issues/53641
- https://docs.github.com/en/copilot/how-tos/copilot-sdk/troubleshooting/mcp-debugging
