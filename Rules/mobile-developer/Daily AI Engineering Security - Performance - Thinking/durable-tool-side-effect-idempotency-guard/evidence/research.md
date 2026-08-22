# Research — Durable Tool Side-Effect Idempotency Guard

## Topic
Durable Tool Side-Effect Idempotency Guard

## Category
Thinking

## Problem
Long-running agents and durable graphs can replay a tool after timeout, worker restart, retry, checkpoint resume, or ambiguous transport failure. If the tool performs a side effect—sending email, charging money, creating a ticket, publishing, deleting, writing a repository, or changing infrastructure—the replay can duplicate the effect even when the orchestration layer itself is durable.

## Why it matters now
Agent frameworks increasingly support checkpointing, retries, resumability, and long-running execution. Those features improve availability but expand the number of paths that can re-enter a tool call after partial completion.

## Affected users
Developers of agentic workflows, LangGraph users, job/queue workers, MCP/tool authors, and platform teams exposing write-capable tools.

## Current public evidence
### Observed evidence
1. LangGraph issue #8464, opened 2026-07-28, reports that retried or restarted graph executions can re-invoke tools and duplicate side effects, and requests durable idempotency/retry middleware: https://github.com/langchain-ai/langgraph/issues/8464
2. LangGraph fault-tolerance documentation explains that retry policies can re-execute nodes after retryable failures and that drained/resumed runs continue from checkpoints. This makes replay behavior an explicit operational concern: https://docs.langchain.com/oss/python/langgraph/fault-tolerance
3. LangGraph issue #8582, opened 2026-08-10, reports a failed `Send` task losing an `UntrackedValue` input when resumed from a checkpoint, illustrating that resume semantics can diverge from the original attempt and require explicit recovery invariants: https://github.com/langchain-ai/langgraph/issues/8582
4. OpenAI Agents SDK issue #4323, opened 2026-08-09, discusses durable pending input and resumable `RunState`, showing active work around state transitions across resumptions: https://github.com/openai/openai-agents-python/issues/4323

## Existing approaches
- Rely on framework checkpointing and retries.
- Disable retries around write tools.
- Let each tool implement its own provider-specific idempotency key.
- Record completed tool calls in application state.
- Ask for human confirmation before high-impact actions.

## Remaining limitations
Checkpoint durability does not prove that an external side effect did or did not happen. Disabling retries sacrifices recoverability. Provider idempotency support is inconsistent. An in-memory completion record is lost on process failure. Confirmation prevents unauthorized intent but does not prevent accidental replay of an already-authorized action.

## Root-cause analysis
- The orchestrator often treats a tool call as a function invocation rather than a transaction spanning local and remote systems.
- A timeout can occur after the remote system committed but before the agent received the result.
- Retry identities are frequently regenerated instead of remaining stable across resume.
- Result caches are not always durable or atomically claimed before execution.
- Read-only and side-effecting tools are not always classified separately.

## Improvement opportunity
Add a reusable action ledger with stable operation keys, pre-execution claims, explicit `in_progress/succeeded/failed/unknown` states, result fingerprints, replay policy, and an `unknown` reconciliation path. The same stable key must survive retry and checkpoint resume. High-impact operations in `unknown` state must reconcile with the external system or require human approval before another attempt.

## Goal
Make retries and resumes safe for side-effecting tools without globally disabling fault tolerance.

## Metrics
- Duplicate side effects in replay tests: 0.
- Side-effecting tool calls with stable operation key: 100%.
- Retry/resume calls that reuse the original key: 100%.
- Ambiguous outcomes classified `unknown` instead of blindly retried: 100%.
- Reconciliation coverage for high-impact `unknown` outcomes: 100%.

## Trigger
Before every side-effecting tool invocation and on retry/resume of an existing invocation.

## Inputs
Workflow/run ID, logical action name, canonical arguments, target resource, side-effect class, attempt metadata, durable ledger state, optional provider idempotency key, and external reconciliation evidence.

## Outputs
Stable operation key, `execute/reuse/reconcile/block` decision, ledger transition, cached result when safe, and audit evidence.

## Interpretation
The evidence does not mean every retry duplicates an effect. It shows a recurring correctness gap: durable orchestration and exactly-once external effects are separate problems.

## Proposed solution
A deterministic idempotency gate plus a bounded recovery workflow. The package never assumes a timed-out write failed; it records ambiguity and requires reconciliation before replay.

## Relevant sources
- https://github.com/langchain-ai/langgraph/issues/8464
- https://docs.langchain.com/oss/python/langgraph/fault-tolerance
- https://github.com/langchain-ai/langgraph/issues/8582
- https://github.com/openai/openai-agents-python/issues/4323
