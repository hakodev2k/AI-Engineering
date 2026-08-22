# Research Evidence

## Topic
External Tool Commit Reconciliation Guard

## Category
Thinking

## Problem
An agent can lose its turn continuation after an external tool mutation has already committed. The visible session then cannot distinguish `not executed`, `committed`, and `committed but result lost`. Blind retry risks duplicate side effects, while refusing to retry can leave the task incomplete or user intent unresolved.

## Why it matters now
Long-running agents increasingly perform connector writes, approval-gated actions, and remote mutations across unreliable network/stream boundaries. Current 2026 reports from separate agent stacks demonstrate the same distributed-state gap: side effects can occur before the agent's durable outcome state is settled.

## Affected users
Agent users performing writes to SaaS systems, developers building tool/connector runtimes, human-approval workflows, multi-step orchestration systems, and teams running long-lived web or distributed agent sessions.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #35658 (2026-07-27, open) reports ChatGPT Work turns silently ending around connector boundaries. In one observed case a Notion write committed successfully, but the tool result, continuation, and final response were lost. A later readback confirmed the page already existed, creating explicit duplicate-retry risk.
2. Microsoft Agent Framework issue #7458 (created 2026-07-31, closed likely-fixed 2026-08-18) documents an approval resume being consumed and the approved tool executing before a later model/stream failure. The retry then receives `APPROVAL_RESUME_NOT_FOUND` even though the side effect already happened. The report proposes two-phase settlement or outcome records with reuse of executed results.

### Interpretation
This is not merely a retry bug. It is a distributed commit-observability problem across agent state and external state. The mutation can become durable in the remote system before the local turn has durably recorded the outcome. Exactly-once execution cannot be guaranteed by blind client retry unless the remote operation itself supports idempotency or the runtime retains a durable mutation identity/outcome.

## Existing approaches
- Retry the failed tool call.
- Ask the user whether the action happened.
- Perform manual readback after a failure.
- Use provider-specific idempotency keys when available.
- Store approval state or checkpoints.
- Two-phase claim/settle patterns and outcome records.

## Remaining limitations
- Blind retry can duplicate a committed mutation.
- A checkpoint may record intent but not prove remote commit.
- Readback is often ad hoc and may not use stable business identifiers.
- Provider idempotency support is inconsistent and may have finite retention windows.
- Approval state durability does not by itself capture the tool's executed result.
- `unknown` outcomes are frequently collapsed into generic failure/not-found states.

## Root-cause analysis
1. No durable mutation identity exists before external dispatch.
2. Intent, dispatch, remote commit evidence, and agent completion are conflated into one status.
3. Tool results are not durably recorded before the next fragile model/stream step.
4. Retry policy lacks an `unknown outcome` state and readback-first branch.
5. Remote business keys/idempotency keys are not consistently captured.
6. The implementation agent may self-declare success without independent readback.

## Improvement opportunity
Introduce a reusable mutation ledger and reconciliation workflow: create a stable operation id before dispatch; record intent and idempotency/business key; mark dispatch; persist returned remote identifiers/result hashes immediately; on lost continuation classify outcome as `unknown`; perform bounded readback before any retry; only retry mutation when evidence indicates it did not commit and retry safety is established; require human approval for dangerous/irreversible ambiguous cases.

## Goal
Turn ambiguous post-tool failures into evidence-driven reconciliation rather than blind retry or unsupported success claims.

## Metrics
Duplicate mutation count, ambiguous-outcome count, percentage reconciled by readback, mean reconciliation latency, unsupported-success count, mutation retries per task, and human escalations.

## Trigger
Lost stream/turn after a mutating tool, tool timeout after dispatch, process crash/restart, approval-resume failure after tool execution, missing tool result, or duplicate retry request.

## Inputs
Operation id, tool name, normalized arguments hash, idempotency/business key, dispatch timestamp, tool result/remote id if any, readback evidence, risk class, and retry policy.

## Outputs
Mutation ledger record, outcome classification (`not_dispatched`, `unknown`, `committed`, `failed`), safe next action, evidence, verification status, and escalation requirement.

## Relevant sources
- https://github.com/openai/codex/issues/35658
- https://github.com/microsoft/agent-framework/issues/7458
