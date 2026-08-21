# Research Evidence

## Topic
Worktree Isolation Invariant Guard

## Category
Security

## Problem
Concurrent coding agents using Git worktrees can execute shell commands or relative-path writes in a sibling worktree when process CWD/isolation identity drifts. Commit-SHA checks can still pass when multiple worktrees point at the same commit, so a wrong-tree mutation may look valid.

## Why it matters now
Two independent Claude Code reports from August 2026 describe current multi-agent worktree isolation/CWD drift, including commands targeting another live agent's tree and branch state.

## Affected users
Developers running parallel coding agents, orchestrators using Git worktree isolation, CI/automation that delegates repository writes, and teams relying on branch/worktree boundaries for agent safety.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #84685, opened 2026-08-07 and still open as of 2026-08-20, reports concurrent subagents changing each other's CWD/isolation identity, duplicate worktree assignment, and relative writes that could land in another agent's checkout.
2. Claude Code issue #85026, opened 2026-08-08 and still open as of 2026-08-20, reports Bash CWD silently moving across sibling worktrees and a `git reset --soft` intended for one worktree moving a sibling branch ref. The report notes identical HEAD SHA is insufficient proof of tree identity.

### Interpretation
The evidence supports a trust-boundary problem at repository routing: an agent must not trust inherited/session-reported CWD or commit identity alone before a write. The reports do not prove every worktree implementation is affected, so this package provides a provider-neutral pre-command invariant guard.

## Existing approaches
- Git worktree isolation and per-agent worktree assignment.
- `pwd`, `git rev-parse HEAD`, or branch checks before risky commands.
- Absolute-path command prefixes.
- Serializing agents when isolation state appears inconsistent.

## Remaining limitations
- HEAD can be identical across sibling worktrees.
- A branch check alone does not validate repository root or proposed write paths.
- CWD can change after an earlier assertion or handoff.
- Relative paths and symlinks can escape the intended root if only string prefixes are checked.
- Existing guard state may itself be stale or shared.

## Root-cause analysis
1. Worktree identity is treated as session state rather than a command-time invariant.
2. Multiple identity dimensions (real repo root, registered worktree, branch, CWD, write targets) are not checked together.
3. Handoffs/resumes may reuse stale shell state.
4. Commit identity is mistaken for checkout identity.
5. Mutating commands are allowed before deterministic boundary verification.

## Improvement opportunity
### Proposed solution
Before every repository-changing command, independently resolve the real Git top-level, current branch, registered worktree set, actual CWD, and every intended write path. Compare them to an immutable expected worktree contract. Block on mismatch/path escape and re-run the check after agent handoff/resume. Require human approval separately for destructive Git operations; this package does not make them safe merely because the tree is correct.

## Goal
Prevent cross-worktree writes caused by CWD/identity drift without weakening OS sandboxing, Git protections, or approval boundaries.

## Metrics
Invariant violations caught, wrong-tree mutation tests blocked, false-block rate, gate latency, handoff mismatch count, security regression failures.

## Trigger
Before shell/file-write operations in an isolated worktree and after any agent handoff, resume, worktree entry, or branch change.

## Inputs
Expected root, optional expected branch, actual CWD, Git metadata, intended write paths.

## Outputs
Machine-readable PASS/BLOCK verdict with observed vs expected identity and violations.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/84685
- https://github.com/anthropics/claude-code/issues/85026
