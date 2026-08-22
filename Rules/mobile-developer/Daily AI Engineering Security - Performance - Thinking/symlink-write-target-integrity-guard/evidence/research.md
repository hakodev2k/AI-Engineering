# Research Evidence

## Topic
Symlink Write Target Integrity Guard

## Category
Security

## Problem
AI coding agents often mix sandboxed command execution with unsandboxed host-side file operations. If path authorization is based on the requested pathname rather than the final filesystem object, an attacker-controlled symlink or worktree path can redirect a later trusted write outside the intended workspace. This creates a confused-deputy boundary where neither component alone appears over-privileged, but their composition can overwrite sensitive files or leak local data.

## Why it matters now
Multiple 2026 advisories and issue reports show symlink/path-identity failures recurring across sandbox writes, temporary files, Git worktrees, and project-controlled guidance loaders. The pattern persists even after individual patches because the underlying boundary is broader than one command or one product.

## Affected users
Developers running coding agents on untrusted or partially trusted repositories, agent-platform builders, sandbox/runtime maintainers, plugin authors, and teams permitting host-side edits after sandboxed commands.

## Current public evidence
### Observed evidence
1. Anthropic advisory GHSA-vp62-r36r-9xqp / CVE-2026-39861 describes a high-severity Claude Code sandbox escape fixed in 2.1.64. A sandboxed process could create a symlink outside the workspace and a later unsandboxed Claude Code write would follow it, enabling arbitrary writes outside the workspace.
2. Anthropic advisory GHSA-7835-87q9-rgvv, published June 25, 2026, describes Git worktree path confusion plus symlink manipulation that could escape sandbox restrictions and overwrite files in the user's home directory; fixed in 2.1.163.
3. Anthropic advisory GHSA-4vp2-6q8c-pvq2, also published June 25, 2026, describes a predictable `/tmp/claude/response.md` path that could be pre-planted as a symlink, causing a privileged process to overwrite an attacker-selected target; fixed in 2.1.128.
4. OpenAI Codex issue #32026, opened July 10, 2026, reports an agent-created temporary Git symlink followed by shell redirection that overwrote the live managed Git wrapper and created a recursive execution loop.
5. Claude Code issue #64582 reports a project-controlled symlink in a security-guidance file being followed to read an external local file and place its contents into an API-bound prompt, demonstrating the same target-identity problem on reads rather than writes.

### Interpretation
These are different surfaces but share one trust failure: authorization is attached to a path string or directory role while filesystem identity can change through symlinks, worktrees, predictable temp paths, or redirection. Per-feature patches reduce known exploits but do not automatically guarantee object identity across every read/write boundary.

## Existing approaches
- Sandbox writable-root policies.
- Canonical path checks before file operations.
- Rejecting selected symlinks.
- Product-specific patches and version updates.
- Randomized temporary files.
- Permission prompts for writes outside declared workspace roots.

## Remaining limitations
- A lexical or one-time canonical path check can still be invalidated between check and use.
- Host-side file APIs may follow symlinks even when the sandboxed process cannot directly access the target.
- Checking only the leaf path misses symlinked parent directories or worktree indirection.
- Blanket symlink bans break legitimate workflows such as linked skill/config directories, encouraging unsafe exceptions.
- Random temp names do not by themselves protect later rename/open operations if target identity is not verified.

## Root-cause analysis
1. Path authorization and file-object authorization are conflated.
2. Different components resolve the same path under different privilege/trust contexts.
3. Symlink components are not consistently inspected across the full path.
4. Check-then-open creates a TOCTOU window.
5. Temporary/output paths are sometimes predictable or shared across users.
6. The write path lacks an invariant tying the authorized root, resolved target identity, and final opened object together.

## Improvement opportunity
Add a reusable target-integrity gate for privileged/host-side reads and writes. The gate should resolve and inspect every path component, reject or explicitly authorize symlink traversal, verify the final target remains inside approved roots, use no-follow or descriptor-relative APIs where available, isolate temporary files, and re-verify identity immediately before activation/rename. High-risk exceptions require human approval and evidence.

## Goal
Prevent path redirection from turning an allowed workspace operation into an unauthorized read/write elsewhere while preserving explicitly approved symlink workflows.

## Metrics
Unauthorized-target test cases blocked, symlink-component detection rate, false-positive rate on approved symlink fixtures, privileged write paths covered, TOCTOU-sensitive operations migrated, and regression-test pass rate.

## Trigger
Any host-side file operation, temp-file activation, plugin guidance read, Git/worktree mutation, or privileged wrapper update using a path influenced by repository or agent activity.

## Inputs
Requested path, operation type, approved roots, symlink policy, expected target existence/type, and optional expected inode/device identity.

## Outputs
ALLOW/BLOCK decision, resolved path, symlink-component evidence, target fingerprint metadata, and required approval state.

## Relevant sources
- https://github.com/anthropics/claude-code/security/advisories/GHSA-vp62-r36r-9xqp
- https://github.com/anthropics/claude-code/security/advisories/GHSA-7835-87q9-rgvv
- https://github.com/anthropics/claude-code/security/advisories/GHSA-4vp2-6q8c-pvq2
- https://github.com/openai/codex/issues/32026
- https://github.com/anthropics/claude-code/issues/64582
