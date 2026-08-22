# Research — Plugin Hook Revocation Consistency Guard

## Topic
Plugin Hook Revocation Consistency Guard

## Category
Security

## Problem
Agent plugin systems can continue executing hook code after a plugin is disabled or removed. The visible plugin state, hook registry, and runtime execution state can diverge, so users may believe third-party code is inactive while stale handlers still run on edits, prompts, or lifecycle events.

## Why it matters now
Multiple 2026 reports across Claude Code and Codex show the same class of lifecycle-revocation failure. This is security-sensitive because hooks can execute commands, mutate repositories, inject model context, or run on every tool/event. A disable/remove action therefore needs a verifiable runtime postcondition, not only a configuration change.

## Affected users
Developers using agent plugins, IDE/desktop-agent users, platform teams implementing plugin systems, security teams enforcing least privilege, and plugin authors relying on lifecycle hooks.

## Current public evidence

### Observed evidence
1. **Claude Code #85893 — 2026-08-11.** A plugin configured with `enabledPlugins: false` had its skill and agent removed from the session, but its `PostToolUse` hook still executed on Edit/Write/MultiEdit and created files in repositories. `/hooks` did not list the hook; only uninstall stopped it. Source: https://github.com/anthropics/claude-code/issues/85893
2. **Codex #38339 — 2026-08-13.** After a plugin was removed and its launcher deleted, an existing Codex Desktop process kept invoking the cached `Stop` hook after every response until a full app restart. Source: https://github.com/openai/codex/issues/38339
3. **Claude Code #35713 — 2026-03-18.** Disabled plugins continued firing `SessionStart` and `UserPromptSubmit` hooks, injecting roughly 15 KB of context and consuming a material fraction of the context window. Source: https://github.com/anthropics/claude-code/issues/35713
4. **Claude Code #58520 — 2026-05.** The VS Code extension reported disabled plugins correctly but still loaded their hook files; the issue report measured additional per-event latency and showed disabled plugins contributing runtime hooks. Source: https://github.com/anthropics/claude-code/issues/58520

### Interpretation
The signals do not prove every plugin runtime has this flaw. They demonstrate a recurring architectural failure mode: configuration/UI state can be updated without synchronously invalidating the effective executable hook registry. A reliable implementation therefore needs observable registry/runtime convergence after revocation.

## Existing approaches
- Persist `enabledPlugins=false` or remove plugin metadata.
- Hide disabled capabilities from UI/skill listings.
- Reload hooks at application/session startup.
- Require a full restart as a workaround.
- Physically uninstall or rename plugin directories.

## Remaining limitations
- Configuration state alone does not prove runtime handlers were detached.
- UI hook listings may not be authoritative.
- Cached handlers can survive source deletion and fail repeatedly.
- Restart-only revocation is easy to misunderstand and leaves a window where stale code remains active.
- Uninstall is operationally heavier than temporary disable and may force later reinstall.
- Missing-file failures can repeat indefinitely unless stale handlers are bounded and quarantined.

## Root-cause analysis
1. Hook discovery/registration is keyed to installed plugin state rather than effective enabled state.
2. Registries are cached per process/session and not invalidated on plugin state transitions.
3. UI listing and execution may read different registries.
4. Plugin source lifetime and handler lifetime are not transactionally coordinated.
5. There is no deterministic postcondition check that compares desired state with active runtime state.
6. Repeated stale-hook failures lack a circuit breaker.

## Improvement opportunity
Introduce a reusable revocation gate that snapshots desired plugin state and effective hook registrations, computes discrepancies, blocks completion of disable/remove operations until stale handlers are detached or the runtime is explicitly marked restart-required, and quarantines unresolved stale handlers after bounded failures. The same registry snapshot should drive both execution and user-visible hook listing.

## Goal
Make plugin disable/remove operations fail closed: no disabled/removed plugin hook may execute unless the product explicitly declares restart-required and prevents affected sessions from treating revocation as complete.

## Metrics
- 100% of disable/remove transitions produce a desired-vs-effective registry comparison.
- 0 runtime executions from plugins whose effective state is disabled/removed after successful revocation.
- 100% executing hooks appear in the authoritative hook inventory.
- Stale-handler failures are quarantined within the configured maximum failures.
- Revocation verification completes without weakening sandbox, approval, or permission controls.

## Trigger
Plugin disable, plugin removal, plugin upgrade, hook configuration reload, session resume, or repeated hook resolution failure.

## Inputs
Desired plugin state, installed plugin metadata, active hook inventory, session/process identifier, hook execution telemetry, and policy configuration.

## Outputs
A deterministic `allow`, `block`, `restart_required`, or `quarantine` decision; stale-hook findings; registry hashes; and verification evidence.

## Proposed solution
Use `scripts/hook_revocation_guard.py` as a deterministic policy gate, `workflows/revoke-and-verify.md` for bounded remediation, and an independent runtime verifier before reporting revocation complete. This package does not claim perfect plugin isolation; it establishes an observable revocation invariant and blocks false-success states.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/85893
- https://github.com/openai/codex/issues/38339
- https://github.com/anthropics/claude-code/issues/35713
- https://github.com/anthropics/claude-code/issues/58520
- https://github.com/anthropics/claude-code/blob/main/plugins/plugin-dev/skills/hook-development/SKILL.md
