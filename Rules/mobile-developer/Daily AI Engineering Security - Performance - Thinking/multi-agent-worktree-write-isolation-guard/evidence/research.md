# Research — Multi-Agent Worktree Write Isolation Guard

## Category
Thinking

## Problem
Parallel coding agents can share a mutable checkout, drift across branches/worktrees, edit stale file versions, or retry writes against files changed by another agent. This turns delegation into a correctness problem: the parent may receive plausible outputs that were produced against the wrong repository state.

## Why it matters now
Current agent products increasingly support parallel subagents. OpenAI's current model guidance describes multi-agent as a beta capability for dividing complex tasks into parallel workstreams. Recent issue reports show that execution isolation has not fully caught up with orchestration capability.

## Current public signals
1. **OpenAI Codex issue #37226 — opened 2026-08-06.** Reports that chats/subagents can share the same local checkout and concurrently modify the same file, causing overwrites, stale reads, and manual conflict management. The requested fix is automatic filesystem isolation/coordination.
2. **OpenAI Codex issue #31572 — opened July 2026.** Reports branch/worktree drift between parent and subagents. The reporter explicitly asks for per-agent worktree/cwd binding or a hard blocker before writes if branch state differs.
3. **OpenAI Codex issue #18969 — opened 2026-04-22.** Requests explicit `cwd` support for `spawn_agent`, noting that prompt-only instructions such as “work in this directory” are not a reliable execution boundary.
4. **Claude Code issue #46968 — opened 2026-04-12.** Reports a parallel subagent repeatedly hitting “File has been modified since read”, consuming ~101k tokens in one worker instead of switching to a safer handoff/temp-file strategy.
5. **OpenAI model guidance.** Multi-agent is intended for parallel independent workstreams, making correct decomposition and isolation essential to realizing the promised wall-clock benefit.

## Existing approaches
- Tell agents in prompts which branch/directory to use.
- Let all agents share one checkout and rely on social conventions such as “do not touch the same files.”
- Manually create git worktrees per agent.
- Assign file ownership informally in the parent prompt.
- Resolve conflicts after subagents finish.
- Re-read and retry failed edits when file content changed.

## Observed limitations
- Prompt instructions are not an execution boundary; cwd/branch can differ from intended state.
- Shared checkout concurrency permits time-of-check/time-of-write races.
- Manual worktree creation adds orchestration overhead and is easy to omit.
- Post-hoc conflict resolution detects problems too late: tests may already have run on invalid mixed state.
- Blind edit retry can burn tokens without progress.
- Parent synthesis may accept a subagent result without proving which commit/branch/worktree produced it.

## Root-cause hypotheses
1. Delegation contracts describe goals but not mutable-resource ownership.
2. Spawn APIs may inherit cwd rather than bind explicit isolated workspace identity.
3. Agents validate task intent but not repository identity immediately before writes.
4. There is no deterministic lease/ownership record for paths.
5. Handoffs report prose instead of machine-checkable base SHA, head SHA, changed paths, tests, and ownership compliance.
6. Retry logic treats concurrent modification as a transient tool failure rather than an orchestration conflict.

## Improvement target
Create a reusable protocol that:
- plans file/resource ownership before parallel work;
- assigns every write-capable worker an isolated git worktree and dedicated branch;
- records expected repo root, base SHA, branch, and owned paths in a task manifest;
- checks cwd, git root, branch, HEAD ancestry, cleanliness, and path ownership before each write phase;
- fails closed on drift or ownership collision;
- limits retry on concurrent modification and escalates to rebase/replan instead;
- requires structured handoffs with patch/test evidence;
- lets an independent verifier reject stale or cross-owned changes before merge.

## Success metrics
- 0 writes performed when actual worktree/branch differs from manifest.
- 0 overlapping owned paths across active write workers unless explicitly declared shared/read-only.
- 100% of write-capable workers emit base SHA, head SHA, changed paths, and test status at handoff.
- Concurrent-modification retry count <= 1 before orchestration escalation.
- 100% of merges pass ownership and ancestry verification.
- Reduced stale-write/conflict rate versus shared-checkout baseline.

## Sources
- OpenAI Codex issue #37226: https://github.com/openai/codex/issues/37226
- OpenAI Codex issue #31572: https://github.com/openai/codex/issues/31572
- OpenAI Codex issue #18969: https://github.com/openai/codex/issues/18969
- Anthropic Claude Code issue #46968: https://github.com/anthropics/claude-code/issues/46968
- OpenAI model guidance (multi-agent beta): https://developers.openai.com/api/docs/guides/latest-model

## Evidence boundary
**Observed evidence:** issue reports document shared-checkout writes, branch drift, missing cwd binding, and retry waste.  
**Interpretation:** reliable multi-agent coding needs workspace identity and ownership to be treated as part of the reasoning/delegation contract.  
**Proposed engineering solution:** the manifest, lease, pre-write checks, handoff schema, and verification workflow in this package are a reusable design derived from those observations; they are not claimed to be an official Codex or Claude standard.