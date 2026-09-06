# Research

## Topic
Subagent Task Routing Integrity Guard

## Category
Thinking

## Problem
Multi-agent coding runtimes can misroute child-agent progress or completion messages to the wrong task/thread, lose parent notifications, or confuse an unrelated task identifier with the worker identity. Once the parent reasons from incorrectly correlated messages, it can update the wrong plan, wait on the wrong worker, or falsely conclude that delegated work completed.

## Why it matters now
A Codex Desktop issue opened on 2026-09-05 reports a subagent sending progress to a historical unrelated task instead of its recorded parent; the parent then confused the unrelated task ID with the worker identity. Earlier Codex reports show adjacent routing/lifecycle failures: a completion watcher could silently miss a child completion if the child disappeared before subscription, and closing an interrupted subagent could block the parent indefinitely. These are separate mechanisms but share a missing invariant: delegated events need durable lineage and destination validation before they are accepted as task state.

## Affected users
Developers using coding-agent subagents, multi-agent orchestration teams, desktop/CLI agent runtimes, workflow builders, and platform engineers implementing delegated task execution.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #42935, opened 2026-09-05, documents a Desktop subagent explicitly sending progress to an unrelated existing task rather than its recorded parent. The parent later treated the relayed task ID as worker identity.
2. OpenAI Codex issue #13244 documents a completion-watcher race where a child can finish before the watcher subscribes, causing the parent notification to be silently dropped.
3. OpenAI Codex issue #31036 documents `close_agent` hanging indefinitely on an interrupted/nonresponsive subagent while the parent remains active/in-progress.

### Interpretation
The common engineering weakness is that asynchronous child events and lifecycle operations are treated as trustworthy task state without a single durable correlation contract. Task IDs, worker IDs, parent IDs, subscriptions, and destination IDs can drift across retries, historical references, or lifecycle transitions. Reasoning quality then degrades because the parent is reasoning over mis-correlated evidence rather than because the model lacks capability.

## Existing approaches
Current runtimes generally track thread IDs, parent-thread metadata, spawn records, watcher subscriptions, task status, and tool-call IDs. These mechanisms are useful but often live in different layers and can fail independently. UI state or message text may also be used to infer progress.

## Remaining limitations
- A message can carry a syntactically valid destination that is not the worker's current parent.
- Historical task references can be mistaken for active routing targets.
- Completion watchers can race with child termination.
- Parent state can remain waiting after the worker is already terminal or absent.
- Human-readable progress text is not a safe substitute for a machine-verifiable lineage envelope.

## Root-cause analysis
1. No mandatory immutable lineage tuple binds `run_id`, `parent_task_id`, `worker_task_id`, and `destination_task_id`.
2. Message dispatch and lifecycle reconciliation use separate state paths.
3. Historical task IDs remain addressable without explicit provenance labels.
4. Parent acceptance does not always verify that the sender is a currently registered child.
5. Missing/late terminal events are not always reconciled against canonical child state.

## Improvement opportunity
Introduce a reusable routing-integrity gate that validates every delegated event against an explicit lineage envelope, rejects cross-task destinations, distinguishes historical references from active parents, and reconciles terminal child state before a parent waits or completes. Verification should be deterministic and independent of model text.

## Relevant sources
- OpenAI Codex issue #42935, 2026-09-05: https://github.com/openai/codex/issues/42935
- OpenAI Codex issue #13244: https://github.com/openai/codex/issues/13244
- OpenAI Codex issue #31036: https://github.com/openai/codex/issues/31036
