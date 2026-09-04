# Research — Subagent Resume Permission Rebinding Guard

## Topic
Subagent permission state can silently drift when a delegated agent is resumed, followed up, or retargeted.

## Category
Security

## Problem
A child agent may start with the intended sandbox/tool permission set, then receive a later task under a different effective policy because the runtime re-resolves permissions incorrectly, keeps stale permissions from an earlier agent role, or applies defaults instead of the persisted security contract. The failure can be restrictive and break work, or permissive and violate least privilege.

## Why it matters now
Multi-agent coding systems increasingly reuse child sessions for follow-up work instead of spawning a fresh isolated process. Permission resolution therefore crosses lifecycle boundaries that are easy to treat as ordinary session state even though they are security-relevant authorization state.

## Affected users
AI coding-agent users, multi-agent platform builders, IDE/desktop agent runtimes, security teams defining sandbox/approval policy, and teams using custom subagent roles.

## Current public evidence
### Observed evidence 1 — OpenAI Codex, 2026-08-23
OpenAI Codex issue #40278 reports that a child initially inherited Full Access correctly, but a later `followup_task` silently changed the child to `approval_policy=on-request`, `sandbox_policy=read-only`, and a restricted permission profile while the parent remained Full Access. The report includes before/after turn-context evidence and describes the intended lifecycle invariant.

Source: https://github.com/openai/codex/issues/40278

### Observed evidence 2 — OpenCode, 2026-08-11
OpenCode issue #41681 reports the inverse class of lifecycle error: resuming a task with a different `subagent_type` changes the prompt/role but keeps permissions derived for the previous agent. The selected role and effective tool permissions therefore disagree.

Source: https://github.com/anomalyco/opencode/issues/41681

### Supporting guidance
Qwen Code documents explicit inheritance rules for subagent approval modes, including parent-mode inheritance and role-specific behavior. This illustrates that permission inheritance is part of the agent contract, not incidental UI state.

Source: https://github.com/QwenLM/qwen-code/blob/main/docs/users/features/sub-agents.md

## Existing approaches
Current frameworks commonly derive permissions at spawn time from parent mode, custom-agent configuration, sandbox defaults, and approval policy. Some persist child sessions and reuse them for follow-up tasks. Permission configuration is often visible in turn/session metadata.

## Remaining limitations
Spawn-time validation alone does not prove later turns are safe. Blindly preserving previous permissions is also incorrect when the role legitimately changes. Blindly recomputing from generic defaults can unexpectedly broaden or restrict authority. Existing user-visible mode labels do not prove that the effective child policy used by the next tool call matches the intended contract.

## Root-cause analysis
1. Authorization state is treated as mutable session metadata instead of a versioned security contract.
2. Resume/follow-up code paths differ from spawn code paths and may skip the same resolver.
3. Role changes and parent-policy inheritance are merged without explicit precedence or provenance.
4. The runtime often lacks an action-time assertion comparing intended versus effective permissions.
5. Tests focus on initial spawn behavior rather than lifecycle transitions.

## Interpretation
The two reports show opposite manifestations of the same engineering problem: resumed-agent authorization is not reliably rebound to the correct current contract. A reusable guard should not hard-code either “preserve” or “recompute”; it should require an explicit expected contract with provenance, resolve it deterministically for the transition, and compare it to effective runtime state before privileged work continues.

## Improvement opportunity
Introduce a transition-time permission envelope containing parent policy, child role policy, explicit overrides, immutable restrictions, and a contract version/hash. Before a resumed/follow-up turn executes tools, compare the effective runtime state to the expected envelope. Fail closed on unapproved broadening; surface restrictive drift as an execution-blocking configuration defect rather than silently changing behavior.

## Goal
Detect and block unauthorized permission broadening and identify restrictive/stale permission drift before the resumed child performs work.

## Metrics
- permission-transition mismatch rate
- unauthorized broadening events blocked
- restrictive-drift events detected before first tool call
- percentage of child turns with recorded policy provenance/hash
- false-positive rate on intentional role changes
- mean time to diagnose permission drift

## Trigger
Any child-agent resume, follow-up, task retarget, custom-role change, sandbox-mode change, or approval-policy change.

## Inputs
Expected policy envelope, previous effective child policy, current parent policy, selected child role, explicit overrides, current effective runtime policy.

## Outputs
Allow/block decision, normalized diff, drift classification, evidence record, and required escalation when broadening is unapproved.

## Relevant sources
- https://github.com/openai/codex/issues/40278
- https://github.com/anomalyco/opencode/issues/41681
- https://github.com/QwenLM/qwen-code/blob/main/docs/users/features/sub-agents.md
