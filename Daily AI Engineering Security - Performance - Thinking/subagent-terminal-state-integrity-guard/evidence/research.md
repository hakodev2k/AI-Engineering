# Research — Subagent Terminal-State Integrity Guard

## Topic
Subagent terminal-state and deliverable integrity

## Category
Thinking

## Problem
Current coding-agent runtimes can mark a delegated subagent as `completed` or successful even when the subagent stopped on an unresolved tool call, hit a context/usage boundary, returned only a mid-task fragment, or produced no required artifact. The orchestrator then treats an incomplete child as valid evidence and continues from a false premise.

## Why it matters now
Fresh August 2026 Claude Code reports show multiple distinct terminal-state failures across Linux, macOS, background agents, usage-limit termination, and deferred Bash execution. These are not just cosmetic UI defects: they cause silent data loss, repeated work, incorrect completion, and wasted tokens.

## Affected users
Developers using coding subagents, engineering teams running parallel reviews or migrations, agent-platform builders, CI/headless automation operators, and any workflow that trusts child-agent status without independently checking deliverables.

## Current public evidence

### Observed evidence
1. **2026-08-14 — anthropics/claude-code #86696.** A subagent emits `Bash` `tool_use`, the command never executes, no `tool_result` arrives, and the run ends with `terminal_reason: tool_deferred`, while `subtype` remains `success` and `is_error` remains false. The issue reports 26/26 unanswered subagent Bash calls on the observation date. https://github.com/anthropics/claude-code/issues/86696
2. **2026-08-13 — anthropics/claude-code #86471.** Background subagents repeatedly report `completed` while returning empty output, a mid-reasoning fragment, or only a report header. The reporter observed 4–5 failures in one long session and had to re-run work. https://github.com/anthropics/claude-code/issues/86471
3. **2026-08-04 — anthropics/claude-code #83848.** Fresh background subagents can stop with no final text while the outer harness reports `status: completed`; transcripts sometimes end after a `tool_use` with no matching `tool_result`. https://github.com/anthropics/claude-code/issues/83848
4. **2026-07-31 — anthropics/claude-code #82829.** Usage-limit termination can be recorded as `completed` and rendered as “Done,” demonstrating that the same success-state ambiguity also occurs on a different termination cause. https://github.com/anthropics/claude-code/issues/82829
5. **2026-08-21 — anthropics/claude-code #88580.** A subagent can spend ~170k tokens and finish with a description of a deliverable instead of the deliverable itself, despite an explicit SubagentStart instruction requiring the final message to contain the findings. https://github.com/anthropics/claude-code/issues/88580

## Interpretation
The recurring failure is not one provider-specific bug. It is a contract problem: orchestrators frequently accept a transport/runtime status as proof of semantic completion. A safe consumer must reconcile lifecycle status, unresolved tool calls, expected artifacts, required output shape, and verification evidence before accepting a child result.

## Existing approaches
- Prompt the subagent to return a complete final answer.
- Check whether the task reports `completed`.
- Inspect an output file after the task finishes.
- Re-run failed or suspicious agents manually.
- Reduce subagent scope to avoid context cliffs.
- Product-side fixes for specific cutoff cases.

## Remaining limitations
Prompt instructions cannot reliably detect or repair harness-level truncation. `completed` is too coarse. Artifact existence alone does not prove content completeness. Blind retry can duplicate side effects or re-spend large context. Product-specific fixes cover individual failure paths but do not provide a portable acceptance contract for orchestrators.

## Root-cause analysis
1. Transport success, lifecycle termination, and semantic task completion are represented as one status.
2. Tool-call/result reconciliation is not always part of terminal-state validation.
3. Expected deliverables are often implicit prose rather than machine-checkable contracts.
4. Parent agents trust child summaries instead of checking declared acceptance criteria.
5. Retry behavior starts from scratch because partial progress and failure reason are not normalized.

## Improvement opportunity
Introduce a deterministic acceptance gate between child termination and parent consumption. The gate must reject or quarantine results when a terminal event conflicts with unresolved tool calls, missing/undersized artifacts, absent required output markers, explicit deferred/limit/error reasons, or missing verification evidence. It should return a normalized state: `accepted`, `incomplete`, `failed`, or `needs_review`.

## Proposed solution
This package provides a reusable terminal-state contract, a JSON-state validator, a deliverable acceptance procedure, an independent verifier role, bounded recovery workflow, and test fixtures covering deferred tool calls, missing artifacts, truncated output, and valid completion.

## Goal
Prevent parent workflows from treating incomplete delegated work as completed evidence.

## Metrics
- false-completion acceptance rate;
- `% child runs with reconciled tool calls`;
- `% required deliverables verified before acceptance`;
- rework/retry rate;
- tokens wasted on full reruns;
- unsupported parent conclusions caused by child output;
- mean time to classify an abnormal termination.

## Trigger
Any subagent/task/worker terminal event before its output is consumed by a parent agent or workflow.

## Inputs
Normalized child status JSON, transcript/tool-call events, expected deliverable contract, optional artifact paths and verification commands.

## Outputs
Acceptance decision, reasons, missing evidence, recovery recommendation, and audit record.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/86696
- https://github.com/anthropics/claude-code/issues/86471
- https://github.com/anthropics/claude-code/issues/83848
- https://github.com/anthropics/claude-code/issues/82829
- https://github.com/anthropics/claude-code/issues/88580

## Verification standard
Implemented means the gate and workflow exist. Measured means fixture and real-run acceptance metrics are captured. Verified means known incomplete states are rejected, valid states are accepted, bounded recovery is exercised, and the implementing agent is not the sole verifier.