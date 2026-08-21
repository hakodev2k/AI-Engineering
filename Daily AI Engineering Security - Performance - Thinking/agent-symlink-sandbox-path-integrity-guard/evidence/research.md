# Research — Agent Symlink Sandbox Path Integrity Guard

- Date: 2026-08-19 (UTC+7)
- Category: Security
- Topic: agent-symlink-sandbox-path-integrity-guard

## Problem
AI coding-agent runtimes often authorize filesystem operations using a path that looks inside a workspace, while the kernel ultimately follows symlinks, worktree metadata, redirects, or other path aliases to a different object. This creates a path-identity gap: an operation approved against lexical path A can mutate canonical object B outside the intended trust boundary.

Affected users include developers running coding agents with workspace-write sandboxes, platform builders implementing file tools, and teams that allow agents to manipulate Git worktrees, temporary wrappers, build artifacts, or repository-controlled paths.

## Why it matters now
This failure class remains current in 2026 across multiple agent implementations. It is not limited to a single historical bug: recent advisories and open issues show path confusion around symlinks, worktrees, temporary paths, and sandbox bind/canonicalization behavior.

## Observed public signals

### 1. Claude Code high-severity symlink sandbox escape
Anthropic published GHSA-vp62-r36r-9xqp on 2026-04-20. A sandboxed process could create a symlink to a location outside the workspace, and a later unsandboxed Claude Code write followed the symlink, allowing an arbitrary write outside the workspace without confirmation. Versions before 2.1.64 were affected.

Source: https://github.com/anthropics/claude-code/security/advisories/GHSA-vp62-r36r-9xqp

### 2. Claude Code worktree/path confusion sandbox escape
Anthropic published GHSA-7835-87q9-rgvv on 2026-06-25. Worktree handling, a worktree named `.git`, symlink manipulation, and Git fsmonitor behavior could be combined to escape the sandbox and overwrite files in the user's home directory. Versions >=2.1.38 and <2.1.163 were affected.

Source: https://github.com/anthropics/claude-code/security/advisories/GHSA-7835-87q9-rgvv

### 3. Current Codex write-through-symlink runtime corruption report
OpenAI Codex issue #32026, opened 2026-07-10 and still open when researched, reports an agent-created temporary Git symlink that pointed at the live managed runtime Git wrapper. A later shell redirection to the temporary path followed the symlink and overwrote the live runtime dependency. The issue explicitly asks for an integrity boundary and canonical/symlink identity checks.

Source: https://github.com/openai/codex/issues/32026

### 4. Current Codex symlink/canonicalization sandbox issues
Codex issue #34530, opened 2026-07-21, reports symlinked filesystem permission paths being canonicalized for bubblewrap but the lexical symlink path then becoming unavailable inside the session. Other 2026 issues (#17079, #14672, #24341) show that symlink/canonical-path handling continues to affect sandbox correctness and availability.

Sources:
- https://github.com/openai/codex/issues/34530
- https://github.com/openai/codex/issues/17079
- https://github.com/openai/codex/issues/14672
- https://github.com/openai/codex/issues/24341

## Existing approaches
1. OS sandboxing such as Seatbelt or bubblewrap.
2. Workspace-root allowlists and deny rules.
3. Canonicalization (`realpath`) before configuring sandbox mounts.
4. Patches for individual known symlink/worktree vulnerabilities.
5. Human approval for writes outside configured roots.
6. Git/worktree-specific guards.

## Observed limitations
- Lexical allowlists are insufficient when a later write follows a symlink to another object.
- Canonicalizing only once during sandbox setup does not protect against path mutation between validation and use.
- Fixes for one symlink primitive do not automatically cover worktrees, temporary files, renamed parents, hard links, or runtime-managed paths.
- A sandboxed producer and an unsandboxed host operation can compose into a write neither component could perform safely alone, as shown by GHSA-vp62-r36r-9xqp.
- Current Codex reports show usability regressions when symlinked paths are simply discarded rather than represented safely; therefore “reject all symlinks” is not a universally practical solution.

## Root-cause hypotheses
1. Authorization is attached to strings instead of filesystem object identity.
2. Validation and write happen at different times or privilege levels, creating TOCTOU opportunities.
3. Parent directories are not revalidated immediately before mutation.
4. Runtime-managed files share a writable namespace with agent-created aliases.
5. Sandbox policy models lexical paths but execution resolves canonical paths differently.
6. Git worktrees and `.git` indirection introduce additional path namespaces not covered by generic workspace checks.

## Improvement target
Build a reusable host-side guard that:
- resolves and records lexical and canonical identity;
- validates every path component and symlink transition;
- rejects writes whose resolved target escapes approved roots;
- detects parent/target identity drift immediately before commit;
- separates runtime-managed/protected roots from normal workspace roots;
- supports an explicit, audited allowlist for legitimate symlinked roots rather than globally disabling symlinks;
- scans repositories/worktrees for dangerous aliases before agent execution;
- produces deterministic evidence and meaningful exit codes.

## Success metrics
Security:
- 100% of regression fixtures that point a workspace path at an outside target are blocked.
- 100% of protected-root targets are blocked even when reached through relative or absolute symlinks.
- Parent-directory identity changes between validate and commit are detected in test fixtures.
- No successful test writes outside configured writable roots.

Operational:
- Legitimate in-root symlinks allowed by policy continue to work.
- Guard decisions include lexical path, canonical path, matched root, reason, and decision.
- Guard adds bounded deterministic overhead measurable per check.

## Interpretation
The evidence supports a recurring engineering class rather than one product-specific defect: sandbox safety fails when authorization and filesystem object identity diverge. The proposed package therefore focuses on a reusable path-integrity contract at the host/tool boundary.

## Proposed engineering solution
Use a two-stage path guard: `preflight` validates requested path, canonical ancestry, symlink policy, and protected roots; `commit-check` revalidates captured identities immediately before mutation. Complement it with a repository/worktree symlink scanner, explicit policy, hooks, adversarial regression tests, bounded retries, and incident-stop rules.
