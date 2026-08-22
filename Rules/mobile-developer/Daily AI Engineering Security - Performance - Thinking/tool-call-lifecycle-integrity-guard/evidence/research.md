# Research — Tool Call Lifecycle Integrity Guard

## Topic
Tool-call lifecycle integrity across approvals, streaming resumes, guardrails, and side-effect execution.

## Category
Security

## Problem
Stateful agent runtimes can lose or duplicate lifecycle records when a run pauses, resumes, streams, trips a guardrail, or retries. An orphaned call, duplicate invocation identity, stale callable, or approval detached from the exact call can cause repeated side effects or inconsistent audit history.

## Why it matters now
Recent OpenAI Agents SDK work documents strict execution lifecycle requirements, while an August 2026 issue reported a streamed resume path leaving a function call without a matching output after an output guardrail trip.

## Affected users
Agent-runtime maintainers, developers building approval workflows, operators of write-capable agents, and teams persisting/resuming long-running tool calls.

## Current public evidence
### Observed evidence
1. OpenAI Agents SDK issue #4125, opened 2026-08-02, reports that a streamed resumed approval flow with an output guardrail trip left a stored `function_call` without its matching `function_call_output`, while the non-streaming path remained paired: https://github.com/openai/openai-agents-python/issues/4125
2. The current Agents SDK tool-execution lifecycle reference requires deduplication by invocation identity, says a repeated call ID must not execute twice, requires enabled-tool/canonical lookup before side effects, and requires input guardrails to run again immediately before invocation after approval pauses: https://github.com/openai/openai-agents-python/blob/main/.agents/references/tool-execution-lifecycle.md
3. The MCP 2026-07-28 tools specification requires structured results to conform to declared output schema and recommends client-side validation, reflecting the wider need to validate tool-result integrity before downstream use: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx

## Existing approaches
- Persist call IDs and approval state in sessions.
- Framework-native tool execution ordering.
- Output/input guardrails.
- Idempotency keys in selected downstream APIs.
- Hard retries after transient failures.

## Remaining limitations
- Session stores can contain orphaned calls/outputs after exceptional control flow.
- Duplicate call IDs can be replayed unless execution checks identity at the last side-effect boundary.
- Approval can become stale if arguments/tool availability change while paused.
- Streaming and non-streaming paths may diverge in persistence behavior.
- Downstream APIs are not uniformly idempotent.

## Root-cause analysis
1. Lifecycle invariants are implicit rather than validated as data.
2. Persistence, approval, guardrails, and invocation are separate state transitions.
3. Resume paths can bypass checks that ran before interruption.
4. Side effects may occur before deduplication/idempotency is conclusively established.
5. Orphan detection is often post-hoc.

## Improvement opportunity
Represent each invocation as a finite lifecycle record with call identity, argument hash, tool identity, approval binding, guardrail status, execution status, and output correlation. Validate invariants immediately before side effects and after persistence/resume.

## Goal
Ensure exactly-once-at-the-agent-boundary execution semantics for a call identity, prevent stale approval/guardrail state from authorizing changed calls, and detect orphaned lifecycle records deterministically.

## Metrics
- 0 duplicate executions for the same invocation ID.
- 100% completed invocations have exactly one terminal output/error record.
- 100% high-impact resumed calls re-run required pre-invocation checks.
- 100% approvals bind to tool identity + canonical argument hash + call ID.
- All orphan/duplicate fixtures are blocked or flagged before side effects.

## Trigger
Before tool invocation, after approval resume, after guardrail result, after session restore, and after tool completion persistence.

## Inputs
Call ID, tool name/version, arguments, approval record, guardrail status, prior execution state, output/error state, side-effect classification.

## Outputs
`allow`, `approval_required`, `deny`, or `integrity_error`, plus invariant violations and call fingerprint.

## Interpretation
The evidence does not imply all agent SDK paths are unsafe. It shows that lifecycle integrity is a real failure surface and that current framework guidance itself treats deduplication, revalidation, and call/output correlation as critical invariants.

## Proposed solution
A deterministic lifecycle validator plus rules, hook, workflow, fixtures, and independent verification for resume/streaming/approval paths.
