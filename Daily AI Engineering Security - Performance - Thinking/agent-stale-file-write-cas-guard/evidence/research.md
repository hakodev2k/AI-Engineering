# Research — Agent Stale-File Write CAS Guard

## Problem
Coding agents can read a file, keep that snapshot in model/tool context, and later write or patch the same path after a human, another agent, an IDE, or a background process has changed it. If the tool host does not revalidate the current file against the snapshot that informed the change, the agent may overwrite newer work, create merge conflicts, or reason from content that no longer exists.

## Category
**Thinking** — reliability of planning, execution, evidence freshness, and verification.

## Why it matters now
Recent reports across multiple coding-agent products show the same class of failure: stale file context, concurrent writes, and last-writer-wins behavior are still recurring in 2026.

## Current public signals

### Signal 1 — Codex concurrent chats can overwrite newer changes
OpenAI Codex issue #37226, opened 2026-08-06, requests automatic isolation and coordination because multiple chats or agents sharing a local checkout can modify the same file concurrently, operate on stale contents, and overwrite newer changes. The reported workaround is manual worktree allocation, file ownership, and merge ordering.

Source: https://github.com/openai/codex/issues/37226

### Signal 2 — Codex retains stale file content after edits
OpenAI Codex issue #22384, opened 2026-05-12, reports that verbatim file content already loaded into model context remains stale after the file is edited. The requested behavior is to invalidate or refresh stale context, or at minimum warn before using the remembered content for another edit.

Source: https://github.com/openai/codex/issues/22384

### Signal 3 — Concurrent user edits conflict with delayed agent writes
OpenAI Codex issue #34757, opened 2026-07-22, reports frequent save conflicts when a user continues editing while Codex is generating and applying changes to the same file.

Source: https://github.com/openai/codex/issues/34757

### Signal 4 — Claude Code concurrent sessions clobber shared state
Anthropic Claude Code issue #73364 reports concurrent sessions rewriting shared `.claude.json` state from stale in-memory snapshots, causing trust and permission settings written by one session to be silently discarded by another. Suggested fixes include merge-on-write, file locking, and compare-and-swap style revalidation.

Source: https://github.com/anthropics/claude-code/issues/73364

### Signal 5 — stale-write detection without prevention is insufficient
Anthropic Claude Code issue #27941 reports stale-write telemetry being detected while the write still proceeds, silently reverting user changes. The report proposes re-read/merge, abort, or at minimum re-read before mutation.

Source: https://github.com/anthropics/claude-code/issues/27941

## Existing approaches

### Worktrees and manual ownership
Parallel writing sessions are isolated into separate worktrees and users manually decide who owns each file.

**Strength:** strong isolation when consistently applied.

**Limitation:** high coordination cost; it does not protect same-worktree human edits, generated files, config files, or tools that still share mutable external state.

### Tool-level “file changed since read” checks
Some editors reject edits when the file has changed since the tool read it.

**Strength:** directly blocks a stale mutation.

**Limitation:** protection is often tool-specific; whole-file writes, shell commands, generated output, custom MCP tools, or internal config writers may bypass the same guard. A warning-only implementation also does not preserve correctness.

### Re-read before write
Agents are instructed to re-open the file before editing.

**Strength:** simple and model-agnostic.

**Limitation:** a race remains between the re-read and the write, and compliance depends on the model/tool workflow.

### File locks
Writers serialize access with locks.

**Strength:** prevents simultaneous writers that honor the lock.

**Limitation:** users and external tools may not participate; long locks harm UX; locks alone do not detect a stale semantic plan created before lock acquisition.

### Git status/diff checks
Agents inspect `git status` or `git diff` before/after changes.

**Strength:** useful verification and change visibility.

**Limitation:** Git status is not a compare-and-swap contract for the exact bytes the agent read. A file can change between status and write, and untracked/config files may still be at risk.

## Observed limitations
The recurring gap is a missing **snapshot-to-write integrity contract**. A mutation should be valid only if the current file content still matches the exact version used to plan that mutation, unless an explicit reconciliation step produces a fresh proposal.

## Root-cause hypotheses
1. Model context is treated as current state instead of a versioned snapshot.
2. Read and write tools do not share a stable version token.
3. Different write paths enforce different freshness checks.
4. Agents retry failed edits without refreshing the evidence that produced the patch.
5. Concurrency is coordinated socially rather than enforced at the mutation boundary.

## Improvement target
Introduce a reusable compare-and-swap (CAS) write contract:

1. On read, capture `sha256`, size, and optional mtime for each file used as mutation evidence.
2. Immediately before any write, recompute the hash from disk.
3. If the hash differs, block the write and return a structured stale-snapshot event.
4. Re-read the current file, rebuild the intended change, and retry at most a bounded number of times.
5. Require independent post-write verification that the resulting file and diff match the intended scope.

Hash equality is authoritative; mtime is diagnostic only.

## Success metrics
- **stale writes committed:** target 0 in concurrency tests;
- **stale-write detection coverage:** 100% for guarded write paths;
- **freshness revalidation rate:** 100% of guarded writes;
- **reconciliation retries:** bounded to configured maximum, default 2;
- **unrelated-line loss:** 0 in concurrent-edit fixtures;
- **false stale detections:** measured and explained; target 0 for unchanged bytes;
- **verification coverage:** 100% of successful writes receive post-write hash/diff verification.

## Proposed engineering solution
The package implements:
- a deterministic Python CAS guard that captures file snapshots and verifies them before mutation;
- a policy file defining retry and verification thresholds;
- enforceable MUST/MUST NOT/SHOULD rules;
- a stale-context reconciliation workflow;
- role-separated implementation and verification agents;
- hooks for pre-write and post-write checks;
- regression tests covering unchanged, modified, deleted, and recreated files.

## Safety
The guard itself never overwrites repository files. It only reads files, writes explicitly requested snapshot/report artifacts, and returns non-zero exit codes on stale state. Applying mutations remains the responsibility of the host agent/tool after the CAS check passes.

## Sources
- OpenAI Codex #37226 — https://github.com/openai/codex/issues/37226 — opened 2026-08-06.
- OpenAI Codex #22384 — https://github.com/openai/codex/issues/22384 — opened 2026-05-12.
- OpenAI Codex #34757 — https://github.com/openai/codex/issues/34757 — opened 2026-07-22.
- Anthropic Claude Code #73364 — https://github.com/anthropics/claude-code/issues/73364.
- Anthropic Claude Code #27941 — https://github.com/anthropics/claude-code/issues/27941.
- GitHub REST repository contents docs note conflicting concurrent content operations and require serialized use — https://docs.github.com/en/rest/repos/contents
- Git documentation describes stat refresh behavior and the distinction between stat metadata and content state — https://git-scm.com/docs/git-update-index
