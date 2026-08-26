# Research — Subagent Terminal-State Evidence Contract

## Topic
False-success terminal states in delegated AI-agent work.

## Category
Thinking

## Problem
A parent agent may receive `completed` or success-like status even though a subagent produced no usable deliverable, stopped mid-tool-use, or lost its final result. This undermines planning, verification, recovery, and confidence calibration.

## Why it matters now
### Observed evidence
1. **Claude Code #86471**, opened **2026-08-13**, reports background subagents shown as `completed` while returning empty output, partial mid-process fragments, or only a report header, causing expensive re-runs.  
   https://github.com/anthropics/claude-code/issues/86471
2. **Claude Code #86696**, opened **2026-08-14**, reports subagent Bash calls ending with terminal reason `tool_deferred`, empty results, `subtype: success`, and `is_error: false`; the report includes a reproducible side-effect probe showing the command never ran.  
   https://github.com/anthropics/claude-code/issues/86696
3. **OpenCode #40527**, opened **2026-08-04**, reports subagents completing dozens of tool calls but losing their work when the final response stream fails (for example HTTP 503), returning an empty parent task result with no retry.  
   https://github.com/anomalyco/opencode/issues/40527
4. **Hermes Agent #94736**, opened **2026-08-25**, reports delegated/cron sessions dying mid-work due to session-persistence failures, leaving empty final responses or incomplete durable work.  
   https://github.com/NousResearch/hermes-agent/issues/94736

## Affected users
Agent orchestrator authors, users of delegated coding/research agents, CI/platform teams, and long-running workflow operators.

## Existing approaches
Framework `completed`/`success` flags, non-empty result checks, manual artifact inspection, transcript/log inspection, and generic retry policies.

## Remaining limitations
- Runtime terminal status can describe process termination rather than task success.
- Non-empty text can be an incomplete fragment.
- Deliverable files/commits/tests are not always checked before success propagation.
- Final-stream failures can destroy otherwise completed work.
- Unbounded retries waste large contexts/tool calls.
- Parent agents may accept claims without evidence attached to completion.

## Root-cause analysis
1. Completion is represented as a scalar status rather than an evidence-bearing state.
2. Acceptance criteria/deliverables are not bound to terminal status.
3. Deferred-tool, persistence, and stream failures can collapse into success-like envelopes.
4. Intermediate checkpoints may be unrecoverable.
5. Parent verification is ad hoc and occurs after status propagation.

## Interpretation
The reliability failure is a control-plane contract problem. `completed` must mean observable acceptance criteria were satisfied, not merely that the child stopped.

## Proposed solution / Improvement opportunity
Require a structured completion envelope with terminal reason, result presence, expected/delivered artifacts, unresolved actions, checkpoint references, and verification state. Validate it deterministically before the parent treats child output as complete.

## Goal
Reduce false success, unsupported conclusions, and full-work re-runs.

## Metrics
False-success rate, missing-deliverable rate, recovery rate, retry rate, rework tokens/time, verification coverage.

## Trigger
Every delegated-task return.

## Inputs
Acceptance criteria, terminal reason, child result, artifacts, unresolved actions, verification evidence.

## Outputs
`complete` or `incomplete` decision plus evidence/recovery path.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/86471
- https://github.com/anthropics/claude-code/issues/86696
- https://github.com/anomalyco/opencode/issues/40527
- https://github.com/NousResearch/hermes-agent/issues/94736
