# Research

## Topic
MCP Error Channel Exposure Guard

## Category
Security

## Problem
MCP tool execution errors may be forwarded to the model through unstructured text. That path can carry stack traces, internal identifiers, downstream payloads, PII, credentials, filesystem paths, SQL fragments, or service topology into LLM context even when successful tool outputs use structured schemas.

## Why it matters now
MCP issue #3003 (2026-07-02) identifies a specification gap: tool execution error examples use unstructured `content[].text` without a schema-governed forwarding contract. The official Python SDK troubleshooting guide also documents that tool execution errors are deliberately returned as tool results so the model can see and react to them, rather than necessarily raising an exception to application code.

## Affected users
MCP server authors, client/host builders, coding-agent platforms, enterprises exposing internal APIs through MCP, and developers processing regulated or sensitive downstream data.

## Current public evidence
### Observed evidence
1. `modelcontextprotocol/modelcontextprotocol#3003` states that the error path can send unstructured content to LLM context and explicitly calls out stack traces, internal identifiers, and PII as examples of possible leakage.
2. The official `modelcontextprotocol/python-sdk` troubleshooting documentation explains that tool errors can return `is_error` results to the model so it can retry; `try/except` around `call_tool` does not catch those normal tool execution errors.
3. The MCP tools specification permits tool results to contain content and marks execution failures with `isError`, so host/server implementations must decide how error details are represented and forwarded.

### Interpretation
A server-side exception boundary is not sufficient protection because an error that is “handled” from the protocol perspective can still be model-visible. Security controls need to run on the error result channel itself, after downstream failure capture but before model/context forwarding and logging.

## Existing approaches
- Return generic user-safe error messages.
- Catch exceptions in tool implementations.
- Global log redaction.
- Successful-output schemas and structured content.
- Host-level content filtering.

## Remaining limitations
- Exception handling and MCP error forwarding are different paths.
- Regex-only filtering can miss unexpected sensitive values.
- Generic errors can remove diagnostics needed by operators.
- Successful-output schemas do not necessarily constrain error text.
- Logs and model-visible content often need different detail levels.

## Root-cause analysis
1. Error payloads are frequently built directly from exception strings or downstream response bodies.
2. No explicit error schema separates model-safe fields from operator-only diagnostics.
3. Trust boundaries between server logs, host telemetry, and model context are blurred.
4. Validation runs on success output but not on failure output.
5. Retry-oriented design incentivizes forwarding rich error text to the model.

## Improvement opportunity
Introduce an error-channel guard that maps raw exceptions to a small model-safe error envelope, keeps detailed diagnostics in a protected operator channel, scans for registered secrets/sensitive patterns, enforces size limits, and tests that raw stack traces/PII never reach model-facing error content.

## Goal
Preserve enough error semantics for safe retry while preventing confidential diagnostics from crossing into model context.

## Metrics
Raw exception leakage rate, sensitive-token leakage rate, model-safe error size, retry success rate, false-redaction rate, operator diagnostic completeness.

## Trigger
Every MCP tool result with `isError=true` or every exception/downstream non-success response converted to a tool result.

## Inputs
Raw exception/error object, tool name, downstream status/code, sensitivity policy, registered secret values, correlation ID.

## Outputs
Model-safe error envelope plus protected diagnostic record identifier.

## Relevant sources
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3003
- https://github.com/modelcontextprotocol/python-sdk/blob/main/docs/troubleshooting.md
- https://modelcontextprotocol.io/specification/2025-11-25/server/tools
