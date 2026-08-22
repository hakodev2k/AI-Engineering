# Research — Agent Worktree Context Integrity Guard

**Research date:** 2026-08-20 (UTC+7)  
**Category:** Security

## Problem

AI coding agents increasingly run inside managed Git worktrees, resume sessions, fork tasks, switch branches, and transplant diffs. A dangerous failure mode occurs when the agent/UI/session believes it is operating in one repository/worktree/branch while Git commands actually resolve another. The result can be edits, commits, patch application, or pushes against the wrong context.

The security property is **repository-context integrity**: before any write, commit, patch application, branch mutation, or push, the host must prove that the active filesystem path, Git common repository, worktree path, branch/detached state, and selected base match the task's approved contract.

## Why it matters now

This is not theoretical. Recent public reports from both OpenAI Codex and Anthropic Claude Code describe stale or divergent worktree/branch state in desktop agent workflows. Git itself provides stable machine-readable primitives such as `git worktree list --porcelain -z` and porcelain status output, but agent products can maintain UI/session state independently from those facts.

## Current public signals

### Signal 1 — Codex worktree/session context divergence, August 2026

OpenAI Codex issue #37591, opened 2026-08-08 and still open when researched, reports that the Codex App branch controls and the task terminal can resolve different worktree contexts within the same task. The report shows a managed worktree/feature branch in the terminal while the app alternates back to a main-branch context after resume/reconnect.

Source: https://github.com/openai/codex/issues/37591

### Signal 2 — Claude Code desktop stale branch/worktree presentation, August 2026

Anthropic Claude Code issue #85114, opened 2026-08-08, reports that the desktop status bar can remain pinned to the branch from session start after mid-session worktree/branch changes. The same issue provides Git evidence of worktree-directory/branch divergence and describes abandoned branches created during app-managed worktree flows.

Source: https://github.com/anthropics/claude-code/issues/85114

### Signal 3 — stale destination base during Codex worktree fork, July 2026

OpenAI Codex issue #33808 reports a fork/new-worktree flow selecting a stale local default-branch commit and applying a source task's uncommitted diff onto that incompatible tree. The report describes missing-index errors, conflicts, repeated fallback application attempts, and recommends refusing mutation when patch base and destination base cannot be proven compatible.

Source: https://github.com/openai/codex/issues/33808

### Signal 4 — Git exposes stable machine-readable worktree state

Git's official `git-worktree` documentation states that multiple worktrees share the repository while maintaining per-worktree state such as `HEAD` and index. `git worktree list --porcelain` is explicitly intended for scripts and has a stable format; `-z` is recommended for safe parsing. Git status porcelain v2 with branch headers exposes current OID, branch head, upstream, and ahead/behind state.

Sources:
- https://git-scm.com/docs/git-worktree
- https://git-scm.com/docs/git-status
- https://github.com/git/git/blob/master/Documentation/git-worktree.adoc

## Existing approaches

1. **Managed worktrees.** They isolate filesystem/index state better than sharing one checkout, but isolation is only useful if the host binds each task to the intended worktree.
2. **UI branch labels/status bars.** Helpful to humans but not authoritative; recent reports show they can become stale.
3. **`pwd` + `git branch --show-current`.** Better than UI state, but still insufficient alone because detached HEAD, symlinked paths, common Git directory identity, and duplicate branch/worktree attachment matter.
4. **Manual restart/reopen or branch switch.** Can restore state temporarily but is operationally fragile and difficult to automate.
5. **Manual clean worktree creation.** Safer in incidents such as stale-base patch transplantation, but requires humans to reconstruct the correct base and path.
6. **Git's built-in refusal rules.** Git refuses some duplicate branch/worktree uses, but those checks do not prove that an agent is in the correct task context before arbitrary file writes.

## Observed limitations

- UI/session state can drift from repository facts after resume, reconnect, manual branch changes, or worktree transitions.
- Worktree path names are not a reliable identifier of branch identity.
- Branch name alone does not identify a repository; two repositories may have the same branch name.
- A detached worktree requires OID/base validation rather than branch-name validation.
- Patch application requires explicit source-base and destination-base compatibility; applying first and handling conflicts later can partially mutate the wrong tree.
- Pre-commit checks are too late for destructive file writes or patch application.
- Generic prompts like “make sure you're on the right branch” depend on model compliance and stale context.

## Root-cause hypotheses

1. **Multiple sources of truth.** UI/session metadata and Git process state are cached separately.
2. **Identity is too weak.** Hosts bind tasks to a branch label or path string instead of a full repository/worktree fingerprint.
3. **Validation occurs too late.** Context is checked at task start, but not revalidated before writes after resume/switch/reconnect.
4. **Patch provenance is implicit.** Source base, destination base, and patch base are not always treated as explicit invariants.
5. **Path normalization gaps.** Symlinks, moved worktrees, nested directories, and sparse checkouts can make textual path comparison misleading.

## Improvement target

Introduce a deterministic **worktree context contract** captured from Git itself and revalidated at security-sensitive boundaries.

The contract should include:

- canonical repository top-level path;
- canonical Git common directory;
- canonical active worktree path;
- current HEAD OID;
- branch ref or explicit detached state;
- optional required upstream/base ref;
- allowed operation class (`read`, `write`, `commit`, `push`, `patch-apply`, `branch-mutate`);
- creation timestamp and policy version.

Before any mutation, the guard recomputes actual state and fails closed on mismatch. Resume/reconnect invalidates cached context until revalidation. Patch application additionally requires a declared source base and destination base.

## Success metrics

- 100% of tested wrong-worktree, wrong-branch, wrong-common-repo, detached-state, and stale-contract vectors are blocked before mutation.
- 100% of allowed writes have a fresh context check within the configured TTL.
- 0 silent auto-rebinding events; mismatches produce deterministic reason codes.
- Patch application never proceeds when source/destination base compatibility is unknown.
- Normal nested-directory operation inside the approved worktree passes without false blocks.
- Regression tests pass on Linux/macOS/Windows Git where available.

## Observed evidence vs interpretation vs proposal

### Observed evidence

Recent Codex and Claude Code reports show stale/divergent branch/worktree presentation and stale-base worktree fork behavior. Git documents stable script-oriented worktree/status interfaces.

### Interpretation

Agent task identity should not depend on UI labels or remembered branch names. Security-sensitive actions need a fresh binding to Git's actual repository/worktree state.

### Proposed engineering solution

This package creates a host-side context contract, deterministic Git-state probe, pre-mutation gate, patch-base guard, bounded recovery flow, and tests. It does not claim to repair upstream agent-product bugs; it prevents those bugs from silently crossing the repository write boundary.