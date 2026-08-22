# Research — Guardrail Session Commit Atomicity Verifier

## Topic
Guardrail Session Commit Atomicity Verifier

## Category
Security / Thinking

## Problem
Agent runtimes can execute tools, hit output guardrails or terminal error handlers, and persist an inconsistent subset of the terminal turn. Examples include a function call without its matching output, streaming/non-streaming divergence, or terminal handler output bypassing normal guardrail/session semantics. Such state is dangerous because later resume, replay, audit, analytics, or custom session callbacks may reason from a conversation history that never existed coherently.

## Why it matters now
OpenAI Agents SDK had multiple August 2026 issues and fixes around terminal-path session persistence, streamed guardrail behavior, resumed approvals, and max-turn handling. Current documentation now specifies stronger persistence semantics, confirming this is an active and subtle runtime boundary.

## Affected users
Developers building resumable agents, approval-gated workflows, streaming agents, session-backed support agents, audit-sensitive systems, and tool-using agents with side effects.

## Current public evidence
### Observed evidence
1. OpenAI Agents SDK issue #4125, opened 2026-08-02, reports a streamed resumed approval path where an output guardrail trip persisted a `function_call` without matching `function_call_output`, while non-streaming behaved differently: https://github.com/openai/openai-agents-python/issues/4125
2. OpenAI Agents SDK issue #4393, opened 2026-08-13, reports a `max_turns` handler path that bypassed output-guardrail session semantics, despite related fixes in other terminal paths: https://github.com/openai/openai-agents-python/issues/4393
3. Current OpenAI Agents SDK guardrail docs explicitly define session persistence behavior for output tripwires, guardrail exceptions, streaming parity, and terminal function-tool redaction/replay validity: https://openai.github.io/openai-agents-python/guardrails/
4. The current Agents SDK release notes describe preserving replay-valid call/output pairs or discarding unsupported current-response suffixes when output guardrails block terminal tool output: https://openai.github.io/openai-agents-python/release/

### Interpretation
The SDK has actively improved these paths, but the failure class is broader than one implementation bug: every runtime with guardrails, approvals, persistence, streaming, retries, and terminal handlers needs an invariant that committed history is replay-valid and semantically equivalent across terminal paths.

## Existing approaches
- Framework-native session persistence.
- Unit tests for individual guardrail paths.
- Cleanup utilities that drop orphan calls before the next model request.
- Application-level exception handlers.

## Remaining limitations
- Repair-on-read can hide corrupted stored state from audit/analytics consumers.
- Streaming and non-streaming code paths may diverge.
- Fixes for one terminal path may not cover max-turn, cancellation, resume, handler, or exception paths.
- Side-effecting tools cannot safely be replayed merely to repair missing outputs.
- A syntactically valid list of session items may still violate call/output or guardrail provenance invariants.

## Root-cause analysis
1. Persistence occurs at several lifecycle points instead of one transactional semantic boundary.
2. Tool execution and final-output acceptance are separate events but state commits are not always modeled atomically.
3. Streaming/non-streaming and resume/fresh-run paths can implement different ordering.
4. Error handlers introduce terminal outputs that may skip normal validation/persistence logic.
5. Session consumers often lack deterministic structural validation before replay.

## Improvement opportunity
Add a framework-agnostic verifier for terminal-turn state. It should validate call/output pairing, side-effect commit evidence, rejected-output absence/redaction policy, terminal-event provenance, and streaming/non-streaming normalized parity. It must never repair history by replaying side effects automatically.

## Goal
Ensure every committed terminal turn is replay-valid, guardrail-consistent, and safe to resume or audit.

## Metrics
- 0 orphan tool calls or orphan tool outputs in committed fixtures.
- 100% terminal events carry an explicit terminal reason.
- Streaming and non-streaming normalized histories are identical for equivalent fixtures.
- 0 automatic side-effect replay during repair/verification.
- All deterministic integrity tests pass.

## Trigger
After a terminal event, before durable session commit, before resume/replay, and after framework/runtime upgrades touching guardrails, sessions, streaming, approvals, or error handling.

## Inputs
Normalized session items, terminal reason, stream mode, guardrail verdict, side-effect flag, optional comparison history from an equivalent execution mode.

## Outputs
`valid`, `invalid`, or `manual_review`, plus structural violations, replay risk, and safe recovery guidance.

## Relevant sources
- OpenAI Agents SDK #4125: https://github.com/openai/openai-agents-python/issues/4125
- OpenAI Agents SDK #4393: https://github.com/openai/openai-agents-python/issues/4393
- Guardrails docs: https://openai.github.io/openai-agents-python/guardrails/
- Release notes: https://openai.github.io/openai-agents-python/release/
