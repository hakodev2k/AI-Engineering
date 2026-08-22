# Research Evidence

## Topic
Delegated Agent Policy Continuity Guard

## Category
Security

## Problem
Hook- and policy-based safeguards that work in a parent or in-process subagent can silently lose visibility or identity guarantees when work is delegated to agent-team teammates or separate subagent execution contexts. The result is a security control that appears enabled globally but is not reliably observable or attributable across every delegate.

## Why it matters now
Multi-agent coding workflows increasingly fan out repository writes, shell commands, commits, and external tool calls. A policy boundary that is not continuous across delegation can create blind spots precisely where concurrency and autonomy are highest.

## Affected users
Developers using agent teams/subagents, platform builders enforcing repository or path policies, security teams implementing hook-based controls, and users relying on remote approval or audit tooling.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #82418, updated 2026-08-18, reports that `PermissionRequest` hooks were never dispatched for agent-team teammates while the same hook-originated `ask` flow worked for an in-process subagent on the same build. The teammate remained blocked in its own pane and the orchestrator saw it as idle, making the approval invisible to the operator.
2. Claude Code issue #76726 reports two separate subagent enforcement gaps: PreToolUse denials did not surface to the parent result, and hook payloads for subagent calls carried the parent `session_id`. The reporter notes that this can break session-keyed locks/claims and make denied fan-out appear successful.

### Interpretation
The problem is not simply a missing permission prompt. The deeper engineering failure is loss of policy continuity across delegation boundaries: control invocation, identity, denial propagation, and parent-visible status are not guaranteed to remain coherent when execution changes process/session topology.

## Existing approaches
- Managed hooks at parent/session scope.
- PreToolUse allow/ask/deny decisions.
- PermissionRequest hooks for external approval UIs.
- Session-keyed registries or worktree locks.
- Parent orchestration that waits for subagent completion.

## Remaining limitations
- A hook can be configured correctly yet not receive a delegated event.
- Parent-visible success may not reflect a denied child operation.
- Parent session identifiers may be insufficient to distinguish concurrent delegates.
- UI visibility can differ by execution mode, leaving an approval stranded in an unattended pane.
- Documentation/configuration alone cannot prove runtime policy coverage.

## Root-cause analysis
1. Policy evaluation is assumed to be inherited rather than runtime-attested per delegate.
2. Delegate identity is not always unique or propagated in a machine-verifiable form.
3. Parent orchestration lacks a required acknowledgement channel for child denials/asks.
4. Security controls are tested in one execution topology and assumed to cover others.
5. There is no deterministic preflight that fails closed when required hook coverage cannot be proven.

## Improvement opportunity
Add a reusable continuity guard that registers a correlation ID and unique delegate identity before fan-out, runs harmless canary checks for required hook events, requires signed/structured acknowledgement of allow/ask/deny outcomes, reconciles child decisions at the parent, and blocks high-risk delegated work when policy coverage cannot be demonstrated.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/82418
- https://github.com/anthropics/claude-code/issues/76726
