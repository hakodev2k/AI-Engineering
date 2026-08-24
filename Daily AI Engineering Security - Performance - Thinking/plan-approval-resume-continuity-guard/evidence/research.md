# Research — Plan-Approval Resume Continuity Guard

## Topic
Durable, replay-safe human plan approval across agent restart, resume, and plan-mode lifecycle transitions.

## Category
Thinking

## Problem
Agent runtimes can represent plan approval in transient UI/tool/session state. When that state is lost, contradicted, or reconstructed after a worker restart, session resume, timeout, compaction, or mode transition, the agent may either proceed without a valid human decision or repeatedly ask for approval to an identical already-approved plan.

## Why it matters now
Recent 2026 bug reports show both sides of the failure: missing approval being treated as permission and valid approval apparently being lost across worker restart. These are operational control-plane problems in long-running agents, not requests for hidden reasoning.

## Affected users
Developers using coding agents, mobile/remote agent users, unattended long-running workflows, agent-runtime maintainers, and platform teams that rely on human plan approval as a safety boundary.

## Current public evidence

### Observed evidence
1. Anthropic Claude Code issue #85095, opened 2026-08-08 and labeled `reproduced`, reports a plan-mode sequence where unanswered questions were followed by an `ExitPlanMode` state error and the agent then performed edits, tests, commit, push, and PR creation without an intervening user approval. Source: https://github.com/anthropics/claude-code/issues/85095
2. Anthropic Claude Code issue #85523, opened 2026-08-10, reports an iOS session repeatedly falling back into plan mode after worker restart and re-issuing the same approval request after an earlier plan had already been approved. The report describes an unattended loop consuming usage and explicitly asks for restored approved-plan state plus a loop breaker. Source: https://github.com/anthropics/claude-code/issues/85523
3. Anthropic Claude Code issue #73435, opened 2026-07-02, reports `AskUserQuestion` auto-continuing after roughly 60 seconds without an answer and notes that the model then chooses a default despite the tool having requested a user decision. It was closed as a duplicate, which is evidence that the behavior class was already tracked elsewhere. Source: https://github.com/anthropics/claude-code/issues/73435

### Interpretation
These signals point to a missing durable decision contract between human approval, plan content, runtime lifecycle, and execution authorization. Tool/UI state and conversational reminders are not sufficient evidence that a specific plan remains approved after state transition.

### Proposed solution
Persist a minimal structured approval receipt after explicit human approval, bind it to exact task ID + plan SHA-256 + workspace revision + permitted phase + time window, and revalidate it deterministically before any resumed execution. Deduplicate an identical valid approval instead of asking again; missing, stale, or mismatched receipts return to an awaiting-approval state. Cap recovery loops.

## Existing approaches
Plan-mode UI and approval prompts, `ExitPlanMode`, `AskUserQuestion`, plan files, process/session checkpoints, conversation replay, system reminders, and generic plan-scope enforcement.

## Remaining limitations
- Approval may exist only in volatile worker/UI state.
- A resumed transcript may contain evidence that a plan was discussed without proving which exact bytes were approved.
- Workspace or plan content can change between approval and execution.
- Error text or default continuation can be misinterpreted as consent.
- Identical approvals can be re-requested indefinitely after state loss.
- Generic scope guards govern what is allowed after approval but do not necessarily prove that approval survived lifecycle transitions correctly.

## Root-cause analysis
1. Approval request, human decision, plan content, workspace revision, and execution phase are not always committed atomically.
2. Runtime state machines can restore plan mode without restoring the associated approval fact, or vice versa.
3. Conversation/model memory is used as a weak substitute for durable authorization evidence.
4. Approval correlation lacks a stable idempotency key/content hash.
5. Recovery paths lack bounded retry/loop-stop conditions.

## Improvement opportunity
Treat plan approval as a durable control-plane artifact rather than an inference. Revalidate it on every restart/resume/compaction/mode transition and make replay idempotent.

## Goal
Zero execution on missing/mismatched approval evidence, zero stale-plan/workspace continuation, and bounded duplicate approval recovery.

## Metrics
Duplicate approval prompts per task, resumed sessions with valid receipts, stale-plan continuation count, workspace-mismatch continuation count, approval bypass count, recovery-loop count, independent verification coverage, and rework due to lost approval state.

## Trigger
Explicit plan approval, worker restart, session resume, context compaction, plan-mode re-entry/exit, workspace revision change, or phase transition.

## Inputs
Plan bytes, receipt JSON, task ID, workspace revision, intended execution phase, policy, current time.

## Outputs
VALID/BLOCKED status, plan hash, findings, lifecycle decision, verification status.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/85095
- https://github.com/anthropics/claude-code/issues/85523
- https://github.com/anthropics/claude-code/issues/73435