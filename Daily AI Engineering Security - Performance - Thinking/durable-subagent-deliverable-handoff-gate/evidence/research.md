# Research Evidence

## Topic
Durable Subagent Deliverable Handoff Gate

## Category
Thinking

## Problem
Multi-agent coding/research systems can mark a subagent run `completed` or `success` even when the parent never receives a complete, durable deliverable. Long investigations may therefore consume substantial time and tokens but leave only intermediate narration, an empty/partial result, or an inaccessible child transcript.

## Why it matters now
Recent August 2026 reports show several distinct terminal paths producing false completion: a long successful subagent can return only a description of a missing report; background subagents can stop before final text while the harness reports completed; headless parent sessions can exit success shortly after dispatching children; and deferred tool calls can leave a child marked successful despite work never executing. These are reliability failures at the orchestration contract, not simply model-answer quality.

## Affected users
Developers using coding-agent subagents, CI/headless agent workflows, engineering teams delegating code review/research to parallel agents, and platform builders implementing agent lifecycle/status APIs.

## Current public evidence

### Observed evidence
1. Anthropic Claude Code issue #88580, opened 2026-08-21, reports a subagent that ran 65 tool calls for ~9 minutes and ~170k tokens, then completed with a message describing a comprehensive table that was never delivered and was not recoverable from its transcript. Prompt-level instructions explicitly requiring the complete deliverable did not prevent the failure.
2. Claude Code issue #83848, opened 2026-08-04, reports fresh background subagents whose transcripts stop before final text while the outer harness still reports `status: completed`.
3. Claude Code issue #85066, opened 2026-08-08, reports a headless SDK session exiting with success seconds after dispatching a multi-agent review; no review was produced and the GitHub Action did not surface failure.
4. Claude Code issue #86696, opened 2026-08-14, reports subagent Bash calls ending with `terminal_reason: tool_deferred`, empty result, and unexecuted side effect while outer fields still indicate success.
5. Claude Code issue #81838, opened 2026-07-28, reports split subagent replies at the output-token ceiling where earlier reply content is silently dropped and only the last assistant message reaches the caller.
6. OpenAI Codex issue #26822, opened 2026-06-06, reports child agents shutting down without delivering results; repeated waits time out and later result retrieval is unavailable.

### Interpretation
A terminal status is not sufficient evidence that delegated work was delivered. The reliable contract must separate execution status from deliverable durability and require a parent-verifiable handoff artifact or complete final payload before completion is accepted. The mechanism should be observable and must not rely on hidden chain-of-thought.

### Proposed solution
Introduce a durable handoff envelope validated before a child is accepted as complete. The envelope records task ID, terminal state, deliverable kind, content or artifact reference, content digest, verification evidence, and whether any deferred/unfinished tool action remains. A deterministic validator rejects `completed/success` when no durable deliverable exists, when hashes mismatch, when the deliverable is empty, or when terminal metadata indicates unfinished/deferred work.

## Existing approaches
- Prompt the subagent to return a complete final message.
- Read child transcripts manually after failure.
- Use final status fields such as `completed`, `success`, or `is_error=false`.
- Persist child output files or use task-output APIs.
- Retry the child when the parent notices missing output.

## Remaining limitations
- Prompt-only requirements can be ignored or defeated by transport/runtime failure.
- A successful status can disagree with actual terminal/tool state.
- Transcripts may contain only intermediate narration, not the assembled final artifact.
- Output files can be ephemeral or inaccessible after lifecycle transitions.
- Blind retry can repeat expensive work without preserving partial evidence.
- Parent agents often have no deterministic criterion for distinguishing a short but valid deliverable from an incomplete one.

## Root-cause analysis
1. Orchestrators conflate worker termination with deliverable acceptance.
2. Final answers are treated as transient messages rather than durable artifacts with integrity metadata.
3. Terminal metadata such as deferred tool use is not included in completion gating.
4. Parent/child protocols lack an explicit handoff schema and receipt acknowledgment.
5. Intermediate evidence is not checkpointed into a form that can survive final-message loss.
6. Retry logic is triggered after loss instead of requiring durability before success.

## Improvement opportunity
Define a minimal cross-runtime handoff schema and validation gate. Require either inline deliverable content or a durable artifact reference plus SHA-256 digest. Reject completion when terminal state contains unfinished/deferred work, deliverable is missing/empty, required evidence is absent, or digest verification fails. Optionally require checkpoints for long-running tasks so partial evidence can be recovered without pretending the task is complete.

## Goal
Ensure delegated work is accepted as complete only when the parent can retrieve and verify the actual deliverable.

## Metrics
- Completion-without-deliverable rate.
- Deliverable digest verification pass rate.
- Fraction of failed runs with recoverable partial checkpoint.
- False-success rate.
- Rework/retry rate after child completion.
- Parent verification coverage.

## Trigger
Use for long-running or expensive subagents, parallel code review/research, headless CI agents, workflow subagents, and any runtime where child status and result delivery are separate channels.

## Inputs
Handoff envelope JSON, optional referenced artifact, policy, terminal metadata, and verification evidence.

## Outputs
Deterministic accept/reject report, explicit blocking reasons, and durable handoff evidence for the parent/orchestrator.

## Relevant sources
- Anthropic Claude Code #88580, 2026-08-21: https://github.com/anthropics/claude-code/issues/88580
- Anthropic Claude Code #83848, 2026-08-04: https://github.com/anthropics/claude-code/issues/83848
- Anthropic Claude Code #85066, 2026-08-08: https://github.com/anthropics/claude-code/issues/85066
- Anthropic Claude Code #86696, 2026-08-14: https://github.com/anthropics/claude-code/issues/86696
- Anthropic Claude Code #81838, 2026-07-28: https://github.com/anthropics/claude-code/issues/81838
- OpenAI Codex #26822, 2026-06-06: https://github.com/openai/codex/issues/26822
