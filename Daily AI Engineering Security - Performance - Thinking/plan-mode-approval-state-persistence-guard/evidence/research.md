# Research

## Topic
Plan Mode Approval State Persistence Guard

## Category
Security

## Problem
A planning-only agent session can cross a resume/relaunch boundary and lose its restrictive permission mode even though the user never approved the plan. A model-visible notice or tool error may then be misread as authorization to mutate files, commit, push, or open a pull request.

## Why it matters now
Anthropic issue #85095, opened 2026-08-08, reports that a Claude Code Plan Mode session proceeded to writes, tests, commit, push, and PR creation after an `AskUserQuestion`/resume failure without user plan approval. On 2026-08-16 an Anthropic collaborator stated the core bug was reproduced on 2.1.233: relaunching a session could drop plan mode and tell the model that plan mode had ended even though no plan had been approved. A separate August 2026 issue, #83568, reports Plan Mode restrictions not being consistently enforced across turns. Official Claude Code documentation states Plan Mode is read-only and that approving a plan is the transition that exits planning into a write-capable mode.

## Affected users
Developers using planning/approval modes in coding agents, IDE/desktop sessions that reconnect or relaunch, teams relying on human approval before mutations, and platform builders implementing resumable permission state.

## Current public evidence

### Observed evidence
1. `anthropics/claude-code#85095` documents an unapproved transition from Plan Mode to implementation after question/resume failure; maintainers marked it reproduced and described resume/relaunch as a trigger.
2. `anthropics/claude-code#83568` independently reports Plan Mode restrictions not consistently enforced across turns.
3. Claude Code permission documentation defines `plan` as read-only and describes explicit plan approval as the transition to a write-capable permission mode.

### Interpretation
The authorization fact is not "the UI/runtime currently says plan mode ended." The authorization fact is a user acceptance event bound to the specific plan and session state. Resume, reconnect, question failure, tool failure, or process relaunch must not manufacture that fact.

### Proposed solution
Persist a fail-closed approval record with a session epoch, plan digest, approval identifier, and accepted state. Before every mutating action, verify that the current plan digest and epoch are bound to a real approval. On resume/relaunch, restore Plan Mode unless such a bound approval exists. Treat notices and tool errors as state observations, never as approval evidence.

## Existing approaches
- Claude Code Plan Mode and permission modes.
- User-facing approval prompts when a plan is ready.
- Project instructions reminding the model not to edit without approval.
- Tool permission hooks and protected-path restrictions.

## Remaining limitations
- Model instructions are advisory if the harness has already widened permissions.
- Permission mode can be reconstructed differently across CLI, IDE, desktop, or resumed processes.
- A generic "mode changed" event does not prove user consent.
- An approval can become stale if the plan changes after it was accepted.
- Protected-path controls do not prevent unapproved writes to ordinary source files.

## Root-cause analysis
1. Permission mode is treated as runtime/UI state rather than durable authorization state.
2. Resume/relaunch reconstructs mode without a fail-closed approval invariant.
3. System notices and tool errors can be semantically ambiguous to the model.
4. Approval is not cryptographically or deterministically bound to the current plan version and session epoch.
5. Mutation dispatch does not always re-check the approval fact at action time.

## Improvement opportunity
Separate `permission_state` from `approval_evidence`. Require an explicit accepted approval record bound to `plan_hash` and `session_epoch`; invalidate it on plan change; make every mutation pass an action-time gate; and add deterministic regression traces for resume, lost question response, stale approval, and plan-change cases.

## Goal
No source mutation or external repository side effect may occur from a planning session unless a current, explicit user approval is present and bound to the active plan.

## Metrics
- Unauthorized mutation attempts blocked / attempted.
- Resume/relaunch cases preserving fail-closed state.
- Stale-plan approvals rejected.
- Approval-to-mutation provenance coverage.
- Regression test pass rate.

## Trigger
Use when implementing or changing plan/review modes, session resume, IDE/desktop reconnects, permission transitions, `AskUserQuestion` handling, or mutation dispatch.

## Inputs
Permission mode, session epoch, plan digest, ordered authorization events, and attempted actions.

## Outputs
A deterministic allow/deny result, reason code, bound approval identifier when valid, and verification evidence.

## Relevant sources
- Claude Code issue #85095, opened 2026-08-08: https://github.com/anthropics/claude-code/issues/85095
- Claude Code issue #83568, opened 2026-08-03: https://github.com/anthropics/claude-code/issues/83568
- Claude Code permission modes documentation: https://code.claude.com/docs/en/permission-modes
- Claude Agent SDK permissions documentation: https://code.claude.com/docs/en/agent-sdk/permissions
