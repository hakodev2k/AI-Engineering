# Research — Approval Input Integrity Guard

## Topic
Approval input integrity across AI-agent tool calls

## Category
Security

## Problem
Human approval is not a meaningful security boundary if the arguments shown to the approver can be missing, defaulted, rewritten, or different from the arguments that execute.

## Why it matters now
Multiple 2026 agent frameworks show independent failures at the same boundary: parsing failures can erase arguments before approval, post-validation hooks can change arguments after approval, nested-agent wrappers can surface the wrong tool, and invalid JSON can cause approval predicates to evaluate an empty object.

## Affected users
Developers building agent runtimes, MCP/ACP clients, approval UIs, workflow engines, and teams allowing agents to spend money, modify files, execute commands, deploy, or send external messages.

## Current public evidence
### Observed evidence
1. Agent Client Protocol issue #1979, opened 2026-08-18, reports `rawInput` using `DefaultOnError`; malformed input may deserialize to absence, making an argument-free permission prompt indistinguishable from genuinely missing input. https://github.com/agentclientprotocol/agent-client-protocol/issues/1979
2. PydanticAI issue #6968, opened 2026-07-30, reports that approvers can see model-original arguments while `after_tool_validate` later rewrites the values that actually execute. https://github.com/pydantic/pydantic-ai/issues/6968
3. OpenAI Agents Python issue #3863, opened 2026-07-17, reports callable `needs_approval` receiving `{}` after invalid JSON is swallowed, creating a fail-open approval decision surface. https://github.com/openai/openai-agents-python/issues/3863
4. Mastra issue #20934, opened 2026-08-07, reports nested agent-as-tool approval surfacing the delegate call rather than the inner approval-bearing tool and arguments. https://github.com/mastra-ai/mastra/issues/20934
5. Codex issue #24823 requests full MCP arguments in approval UI because dangerous payloads may live entirely in tool arguments. https://github.com/openai/codex/issues/24823

## Existing approaches
Framework-native approval callbacks, UI confirmation prompts, MCP/ACP permission messages, tool schema validation, and per-tool allow/deny policy.

## Remaining limitations
These controls often bind approval to a tool-call identity or display object rather than a canonical post-validation argument payload. Parse/default events may be lossy, transforms may occur after approval, and delegation layers may project the wrong call.

## Root-cause analysis
1. No canonical approval payload is defined after all deterministic transforms.
2. Missing, malformed, and defaulted arguments are not always distinguishable.
3. Approval and execution can consume different representations.
4. Nested/deferred tool calls can lose identity or argument provenance.
5. Many systems do not revalidate the approved digest immediately before execution.

## Improvement opportunity
Bind approval to a canonical tool identity plus canonical serialized arguments after validation/transforms. Fail closed when approval-bearing argument parsing is lossy. Record a digest at approval time and require an exact digest match immediately before execution.

## Goal
Ensure the human or policy engine approves exactly what executes.

## Metrics
- approval/execution digest mismatch count
- malformed/defaulted approval payload blocks
- nested approval identity mismatch count
- percentage of high-impact calls with verified approval digest
- false-positive rate

## Trigger
Any tool call requiring human or policy approval.

## Inputs
Tool identity, raw model arguments, parsed arguments, validated/transformed arguments, approval record, execution arguments.

## Outputs
Canonical approval envelope, digest, decision, block reason, audit evidence.

## Proposed solution
A deterministic Python verifier plus rules, workflow, and independent reviewer contract that canonicalize JSON, distinguish parse loss from true absence, hash the final approval envelope, and compare it against the execution envelope.

## Verification
Security is verified only when malformed input is blocked, transformed arguments require a new approval digest, nested tool identity mismatch is blocked, unchanged canonical arguments pass, and no secrets are logged.
