# Research

## Topic
Quota-Interrupted Subagent Resume Contract

## Category
Thinking

## Problem
In-flight subagents can be terminated by quota or runtime interruptions and later restarted without their own durable progress, causing duplicated work, lost evidence, inconsistent parent/child state, or repeated side effects.

## Why it matters now
On 2026-09-02, Claude Code issue #91449 reported that usage-limit interruption kills in-flight subagents; resuming a workflow restores completed cached agents but restarts unfinished agents from scratch. Earlier, OpenAI Codex issue #29996 reported a subagent hitting a usage quota while the UI continued to show it working and the parent finalized incorrectly. Separately, go-micro issue #4341 specified durable agent checkpoint/resume as a requirement and explicitly required proving that resume does not duplicate completed tool calls.

## Affected users
Developers using multi-agent coding workflows; CI automation; research agents; platform teams operating long-running tool-using agents; users with quota-limited model plans.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code #91449, opened 2026-09-02: unfinished subagents restart from scratch after usage-limit interruption while completed calls are restored from cache.
2. OpenAI Codex #29996, opened 2026-06-25: quota exhaustion can interrupt a subagent while lifecycle state remains misleading and the parent may finalize.
3. go-micro #4341, opened 2026-07-08: durable checkpoint/resume work explicitly requires a deterministic harness showing resume without duplicated completed tool calls.

### Interpretation
Parent-level checkpoints are not sufficient for nested agent execution. Safe recovery needs child-level progress identity and explicit side-effect reconciliation. The failure is not only availability; it is reasoning integrity because the resumed workflow may infer that prior investigation or writes were either completed or absent without evidence.

### Proposed solution
A reusable resume contract that makes child progress reconstructable and blocks resume when input identity, effect history, checkpoint phase, or verifier requirements are missing.

## Existing approaches
Parent workflow checkpoints; completed-call caching; full subagent restart; idempotency keys for selected external tools; process-level retry.

## Remaining limitations
Completed-call caches do not capture partial child reasoning artifacts or uncommitted evidence. Full restart wastes tokens/time and can replay effects. Idempotency is not universal. UI lifecycle state can diverge from actual execution state. Parent checkpoints often lack child input fingerprints and exact safe-resume points.

## Root-cause analysis
1. Child execution is treated as an opaque tool call rather than a durable state machine.
2. Checkpoints record completion, not the last verified internal phase.
3. External effects and model progress are stored in different systems with no reconciliation contract.
4. Retry logic conflates transport failure, quota failure, and unknown side-effect outcome.
5. Completion can be decided by the parent without independent evidence that interrupted children reached terminal state.

## Improvement opportunity
Persist a small portable child checkpoint record: task/input fingerprint, phase, durable artifacts, side-effect ledger, last completed tool-call identity, retry count, and verification status. Gate resume deterministically and require independent verification for write-capable workflows.

## Goal
Resume interrupted subagents without losing verified progress, replaying completed side effects, or allowing the parent to report completion prematurely.

## Metrics
Recovered-work ratio; duplicate effects; repeated model/tool calls; recovery latency; false-completion rate; verifier rejection rate.

## Trigger
Quota exhaustion, provider rate-limit interruption, process restart, workflow checkpoint restore, or child-agent crash.

## Inputs
Checkpoint record, original task identity, current task/input fingerprint, effect ledger, policy, verifier evidence.

## Outputs
ALLOW/BLOCK resume decision, reasons, safe resume phase, recovery evidence, final verification status.

## Relevant sources
- Anthropic Claude Code #91449 (2026-09-02): https://github.com/anthropics/claude-code/issues/91449
- OpenAI Codex #29996 (2026-06-25): https://github.com/openai/codex/issues/29996
- go-micro #4341 (2026-07-08): https://github.com/micro/go-micro/issues/4341
- Microsoft Conductor #167 (2026-05-06), illustrating checkpoint/UI context divergence: https://github.com/microsoft/conductor/issues/167
