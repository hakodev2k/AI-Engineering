# Research — Agent Unchanged-File Reread Cache Guard

## Problem
Long-running coding agents frequently re-read files or file ranges whose content has not changed. Each redundant read adds tool latency and may re-inject duplicate tokens into context. Compaction makes the problem harder because detailed read-state can be lost even though the underlying file is unchanged.

## Category
Token

## Why it matters now
Recent public reports show the problem is active across major coding-agent ecosystems and affects both token cost and task progress.

## Current public signals

1. **OpenAI Codex issue #33498 — 2026-07-16.** A user reports agents repeatedly retrieving documents already read completely while hashes confirm the files have not changed. The reported impact is avoidable token use, latency, and context pressure, especially in controller/subagent workflows.
   Source: https://github.com/openai/codex/issues/33498

2. **Anthropic Claude Code issue #86291 — 2026-08-13.** A reproducible post-compaction failure loops on the same file and offset without making progress. Repeated `Read` calls become the dominant behavior and the session effectively stalls.
   Source: https://github.com/anthropics/claude-code/issues/86291

3. **Anthropic Claude Code issue #85488 — August 2026.** Read-state can be lost across auto-compaction, producing “File has not been read yet” for files already read and unchanged. The report describes a steady wasted round trip per file per compaction and notes that rereading large files pushes the next compaction closer.
   Source: https://github.com/anthropics/claude-code/issues/85488

4. **Claude Code feature request #49048 — 2026.** A user-built workaround proposes read caching that blocks unchanged re-reads, returns diffs after changes, limits large reads, and clears state after compaction. This demonstrates practical demand for deterministic host-side controls rather than prompt-only advice.
   Source: https://github.com/anthropics/claude-code/issues/49048

5. **Claude Code docs issue #40123 — 2026-03-28.** The issue references changelog behavior that deduplicates unchanged re-reads to reduce token usage, showing that native optimization is useful but may not be uniformly available across clients, versions, custom agents, MCP hosts, or orchestration frameworks.
   Source: https://github.com/anthropics/claude-code/issues/40123

## Existing approaches

### Prompt rules such as “do not reread unchanged files”
Low integration cost, but dependent on model compliance and on the model correctly remembering what has already been read.

### Native client deduplication
Useful when present, but host-specific. It may not survive compaction, custom tool wrappers, subagent boundaries, or alternative SDKs.

### Generic caching
A raw path-based cache is unsafe because file content may change while the path stays the same, and partial reads need range-specific accounting.

### Conversation summaries
Summaries reduce context size but do not prove that a file is unchanged and can lose exact line/range coverage.

## Observed limitations
- Read-state can disappear across compaction.
- Path-only caches risk stale data.
- Whole-file caching does not represent partial reads correctly.
- Model memory is not a reliable source of read-state truth.
- Duplicate reads may occur across subagents even when one agent already fetched the content.
- A cache that never invalidates can silently break correctness.

## Root-cause hypotheses
1. Tool-read state is ephemeral and omitted from compacted summaries.
2. Orchestrators do not share a durable content fingerprint ledger across agents.
3. Agents cannot cheaply prove whether a path changed since the last read, so they choose the safe but expensive action: read again.
4. Read tools often expose path/range but not a stable content version token.
5. Cache invalidation is treated as prompt logic instead of deterministic infrastructure.

## Proposed engineering solution
A **content-fingerprint, range-aware read ledger** at the tool boundary:
- fingerprint file content or selected range before returning it;
- record path, canonical path, size, mtime, content hash, requested range, returned range, and observation generation;
- before a new read, compare current metadata/hash with compatible ledger entries;
- return a compact `UNCHANGED_READ` receipt instead of duplicate content when the requested range is already covered by the same fingerprint;
- invalidate on edit/write/move/delete or proven metadata/hash change;
- after compaction, preserve fingerprints and coverage but mark semantic context availability separately;
- permit an explicit `force=true` reread when exact content must be reintroduced after compaction or for verification.

## Safety constraint
The guard must never silently suppress content required for correctness. “Unchanged on disk” and “still available in the model context” are different facts. The ledger tracks both **content identity** and **context residency**. If content was compacted away and exact text is needed, the system may rehydrate it intentionally while recording the reason.

## Success metrics
- duplicate read bytes/task
- duplicate read tokens/task
- repeated identical read calls/task
- tool latency spent on redundant reads
- cache hit rate
- false cache-hit rate (target: 0 in test corpus)
- forced rehydrations after compaction
- task-quality regression rate
- context-window utilization before/after

## Improvement target
At least 80% reduction in identical unchanged reread bytes on a representative replay corpus, with zero stale-content substitutions and no task-quality regression in verification cases.

## Sources
- OpenAI Codex #33498: https://github.com/openai/codex/issues/33498
- Anthropic Claude Code #86291: https://github.com/anthropics/claude-code/issues/86291
- Anthropic Claude Code #85488: https://github.com/anthropics/claude-code/issues/85488
- Anthropic Claude Code #49048: https://github.com/anthropics/claude-code/issues/49048
- Anthropic Claude Code #40123: https://github.com/anthropics/claude-code/issues/40123
