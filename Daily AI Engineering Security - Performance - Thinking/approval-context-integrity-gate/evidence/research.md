# Research — Approval Context Integrity Gate

## Topic
Approval-context integrity for tool calls and agent permission prompts.

## Category
Security

## Problem
Human approval is only a meaningful security boundary when the prompt shows the material action being authorized. Current agent and protocol implementations can omit, default, or hide tool arguments while still presenting a valid-looking approval request. A user or policy engine can therefore approve an operation without seeing the exact command, paths, payload, or MCP arguments that the agent intended to execute.

## Why it matters now
The problem is current across multiple agent surfaces in 2026. ACP v1.6.0 allows `rawInput` on a permission-bearing `ToolCallUpdate` to deserialize with default-on-error behavior, making malformed input indistinguishable from absent input at the client. Cursor users reported July 2026 approval UIs that stopped showing MCP arguments. Qwen Code had the same class of subagent approval failure: the prompt showed only a generic question and no command or tool arguments.

## Affected users
- Developers reviewing MCP, shell, file-write, deployment, or destructive tool calls.
- Agent-platform teams implementing ACP or similar client/agent protocols.
- Security teams relying on human-in-the-loop approval as a control.
- IDE and orchestration builders normalizing tool calls across agent backends.

## Current public evidence

### Observed evidence
1. **ACP issue #1979, 2026-08-18.** `ToolCallUpdate.raw_input` uses default-on-deserialization-error behavior. A permission request may remain protocol-valid while the UI cannot distinguish absent input from input that failed to parse. https://github.com/agentclientprotocol/agent-client-protocol/issues/1979
2. **Cursor community bug, July 2026.** Users reported that MCP approval prompts no longer surfaced tool arguments, making it impossible to inspect exact document content or paths before approval. Cursor support acknowledged the regression and recommended avoiding broad auto-run while unresolved. https://forum.cursor.com/t/can-not-see-call-args-in-mcp-tool-calls/165328/11 and https://forum.cursor.com/t/can-not-see-call-args-in-mcp-tool-calls/165328/19
3. **Qwen Code issue #3960, 2026-05-08.** Subagent approval prompts displayed only a generic proceed question and omitted the actual tool/command arguments. https://github.com/QwenLM/qwen-code/issues/3960
4. **Cursor current MCP documentation.** Cursor documents approval before MCP use by default and an expandable argument view, establishing the intended disclosure behavior. https://prod.cursor.com/docs/mcp
5. **ACP schema.** `RequestPermissionRequest` carries a `ToolCallUpdate`; `rawInput` is optional/default-on-error. https://github.com/agentclientprotocol/agent-client-protocol/blob/main/schema/v1/schema.json

### Interpretation
These independent reports point to a common control-plane weakness: approval transport and approval rendering can silently lose the exact action context while preserving an apparently valid approval flow. The approved artifact can therefore be weaker than the executable artifact.

## Existing approaches
- Interactive permission prompts.
- Tool-specific allow/ask/deny policies.
- MCP annotations and risk classification.
- Product UIs that expand tool arguments.
- Exact command permission rules.
- External policy engines evaluating normalized calls.

## Remaining limitations
- A permission request can be structurally valid while material fields are absent or defaulted.
- Human-facing summaries are not necessarily bound to executable arguments.
- Different clients render different subsets of tool-call metadata.
- `Allow once` can authorize the wrong payload if display and execution payloads differ.
- Missing disclosure is often treated as a UX degradation instead of a blocking integrity failure.

## Root-cause analysis
1. Execution payload and approval-display payload travel through different serialization/rendering paths.
2. Optional/defaulted metadata improves protocol robustness but can erase evidence that parsing failed.
3. Approval decisions are commonly bound to a call ID/session/tool name rather than a canonical hash of exact arguments.
4. Clients optimize for concise prompts and may hide arguments.
5. Policy engines often assume the normalized call they evaluated is exactly the call later executed.

## Improvement opportunity
Introduce a fail-closed approval integrity gate that compares the canonical executable action with the disclosure artifact before approval can authorize execution. Require material arguments for sensitive operations, detect defaulted/parse-failed fields, hash canonicalized arguments, and optionally require the approval decision to carry the same action hash.

## Proposed solution
This package provides a deterministic Python guard, enforceable rules, a reusable audit skill, an independent reviewer contract, a bounded inspection workflow, and tests. It validates that the exact action shown to the reviewer is the exact action eligible for execution.

## Goal
Make `approved` mean the reviewer saw and approved this exact canonical action.

## Metrics
- `approval_disclosure_missing_rate`
- `approval_payload_mismatch_rate`
- `defaulted_input_block_count`
- `approval_hash_mismatch_count`
- `% sensitive calls with canonical action hash`
- false-positive rate on read-only/low-risk calls
- security test pass rate

## Trigger
Before a permission-bearing tool call is presented to a human/policy reviewer and again immediately before executing an approved call.

## Inputs
JSON approval envelope containing source tool-call fields, displayed fields, risk/sensitivity, and optional approval binding hash.

## Outputs
Machine-readable verdict, reason codes, canonical action hash, and blocking exit code.

## Relevant sources
- https://github.com/agentclientprotocol/agent-client-protocol/issues/1979
- https://github.com/agentclientprotocol/agent-client-protocol/blob/main/schema/v1/schema.json
- https://prod.cursor.com/docs/mcp
- https://forum.cursor.com/t/can-not-see-call-args-in-mcp-tool-calls/165328/11
- https://forum.cursor.com/t/can-not-see-call-args-in-mcp-tool-calls/165328/19
- https://github.com/QwenLM/qwen-code/issues/3960
- https://code.claude.com/docs/en/permissions
