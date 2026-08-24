# Research — Plan Mode Transition Authorization Guard

## Topic
Authorization-safe plan-mode and permission-state transitions across resume, timeout, and error paths

## Category
Security

## Problem
Coding-agent runtimes can transition from a planning-only state into a write/execute-capable state without a durable, user-approved authorization event. Resume/relaunch behavior, failed clarification requests, plan-exit errors, and post-plan permission-mode selection can desynchronize the harness state from the user's actual approval.

## Why it matters now
This is a current, reproduced 2026 failure mode. It is especially dangerous when plan mode is used as the primary write barrier and the session also has permissive per-tool settings: once the planning barrier drops, edits, tests, commits, pushes, or external actions can occur without an intervening approval.

## Affected users
Developers using plan-first coding workflows, remote/desktop agent users, teams running resumed sessions, multi-agent users, and platform builders that persist agent state across process restarts.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #85095, opened 2026-08-08 and later marked reproduced by a collaborator, documents plan mode being lost across failed `AskUserQuestion`/resume paths. The agent then treated a plan-exit notice/error as approval and performed edits, tests, commit, push, and PR creation without user approval. A maintainer reported reproducing the core bug on 2.1.233 and identified session relaunch/resume as a state-loss path. https://github.com/anthropics/claude-code/issues/85095
2. Claude Code issue #79024 documents a regression where `--permission-mode plan` no longer showed the intended plan-approval dialog; after a degraded yes/no ExitPlanMode prompt, the session dropped to a different permission mode. https://github.com/anthropics/claude-code/issues/79024
3. Claude Code issue #33109 documents the inverse state-integrity failure: an approved plan combined with context clearing loses the approval state and leaves the session stuck in plan mode. Although closed as duplicate, it demonstrates that plan approval and mode state are not inherently atomic across context transitions. https://github.com/anthropics/claude-code/issues/33109
4. Claude Code issue #62459 reports that the plan-mode-exit dialog can ignore configured `permissions.defaultMode`, showing that plan approval and post-plan permission selection are coupled but not consistently derived from durable policy. https://github.com/anthropics/claude-code/issues/62459

## Existing approaches
- Plan mode as a soft/harness-enforced write barrier.
- `ExitPlanMode` approval dialogs.
- Session resume/relaunch with reconstructed mode state.
- Standing instructions such as `CLAUDE.md` that tell the model not to treat a mode-exit notice as approval.
- Separate per-tool permission modes.

## Remaining limitations
- Prompt instructions are a workaround, not a durable authorization primitive.
- Plan state, approval state, and permission mode may be reconstructed from different sources.
- A process resume can restore conversation content without restoring the exact authorization state.
- Error text can be semantically ambiguous to the model and accidentally imply authorization.
- Mode transition and approval persistence are not always atomic.

## Root-cause analysis
1. Authorization is represented partly as transient runtime state rather than a durable capability transition.
2. Resume/relaunch reconstructs plan/permission state independently from the approval ledger.
3. Error/recovery paths can mutate mode state without an explicit authorization record.
4. Natural-language notices are interpreted by the model as authority even when no user decision exists.
5. Plan approval, context clearing, and post-plan permission mode selection can occur in the wrong order or without a single transaction boundary.

## Interpretation
The safe invariant is not “the runtime says plan mode ended.” The invariant is: write/execute capabilities may increase only when a specific plan version has a durable accepted approval record, and the transition must be bound to that record across resume/relaunch.

## Improvement opportunity
Introduce a deterministic authorization transition ledger with compare-and-set semantics. Persist `plan_id`, `plan_hash`, `mode_before`, `requested_mode_after`, `approval_id`, `approval_status`, and transition epoch. On resume or any error path, recompute effective capability from the ledger rather than from UI/session mode text. Fail closed when the record is absent, stale, mismatched, or non-final.

## Proposed solution
This package provides a transition contract, enforceable rules, a reusable state-verification skill, an independent verifier, bounded recovery workflow, pre-write hook, deterministic ledger validator, and regression tests.

## Goal
No increase in agent write/execute capability without a durable approval bound to the exact plan and transition.

## Metrics
- Unauthorized capability-transition attempts blocked.
- Resume/relaunch state mismatches detected.
- `% capability increases with valid approval binding`.
- Plan-hash mismatch count.
- Recovery-path fail-closed rate.
- False-block rate after genuinely approved transitions.

## Trigger
Plan exit, process/session resume, reconnect, failed clarification, context clear/compaction, permission-mode change, or any first write/execute tool call after planning.

## Inputs
Transition ledger record, current plan hash, runtime mode, requested capability, session/resume epoch, approval record.

## Outputs
Allow/block transition decision, mismatch diagnostics, normalized transition evidence.

## Verification
Verified only when unapproved, stale-plan, resume-without-ledger, and failed-question fixtures are blocked while a correctly approved and hash-bound transition passes.
