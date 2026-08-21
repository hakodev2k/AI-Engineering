# Research — Agent Repository Scan Amplification Guard

**Research date:** 2026-08-20 (UTC+7)  
**Category:** Performance

## Problem
AI coding-agent hosts and extensions can repeatedly rescan large repositories, untracked trees, sandbox writable roots, or saved-but-inactive projects even when the active task does not require a full repository inventory. The resulting scan amplification can saturate CPU or disk, spawn large numbers of short-lived processes, and inflate latency for otherwise fast tool calls.

This is not the same problem as model retry loops or repeated identical semantic tool calls. The amplification can originate in host bookkeeping, sandbox refresh, extension indexing, Git discovery, or worktree setup outside the model's explicit reasoning loop.

## Why it matters now
Recent public issues in Codex show the same operational pattern from multiple paths: runaway `rg --files` process storms after worktree creation, repeated Git scans of large untracked directories, inactive saved repositories being scanned, and sandbox setup recursively touching large writable roots before nearly every tool call. These failures are especially damaging on monorepos and dependency-heavy workspaces where one accidental full-tree walk can become expensive and repeated walks compound quickly.

## Current public signals

### Signal 1 — thousands of repeated `rg --files` scans
OpenAI Codex issue #38105, opened 2026-08-12, reports a VS Code session on Windows spawning a runaway storm of bundled `rg.exe --files` processes after worktree creation. The reporter describes machine-wide degradation, with terminal input becoming extremely slow and a 5-second sampler stalling for hundreds of seconds.

Source: https://github.com/openai/codex/issues/38105

### Signal 2 — repeated Git scans of large untracked directories
OpenAI Codex issue #35008, opened 2026-07-23, reports sustained high CPU on Windows caused by repeated Git scans of large untracked directories even when no task was actively running.

Source: https://github.com/openai/codex/issues/35008

### Signal 3 — inactive saved repositories still scanned
OpenAI Codex issue #32113, opened 2026-07-10, reports expensive `git ls-files --others` scanning for a very large repository merely because it was saved as a project, despite not being the active workspace.

Source: https://github.com/openai/codex/issues/32113

### Signal 4 — sandbox setup recursively processes roots before tool calls
OpenAI Codex issue #33737, opened 2026-07-17, reports elevated sandbox setup repeatedly traversing a pnpm workspace, saturating disk and adding roughly 30–130 seconds to tool calls. Issue #34529 similarly reports 1–2 minute sandbox refresh overhead before each shell or patch operation.

Sources:
- https://github.com/openai/codex/issues/33737
- https://github.com/openai/codex/issues/34529

## Existing approaches
1. `.gitignore` and dependency-directory exclusion reduce some Git/untracked scans.
2. Ripgrep ignore rules reduce explicit search cost when scans honor them.
3. Sparse checkout and smaller worktrees reduce physical tree size.
4. Disabling or closing inactive projects avoids some background scans manually.
5. Host caching/indexing can avoid repeated discovery when implemented correctly.
6. Sandbox implementations may cache writable-root setup or narrow protected roots.

## Observed limitations
- Ignore files are not guaranteed to affect every host bookkeeping or sandbox traversal.
- Large dependency trees may still be inside writable roots even when ignored by Git.
- Manual project closing is fragile and does not help active-project repeated scans.
- A host can rescan the same unchanged tree without exposing scan count, bytes walked, process count, or reason.
- Tool latency dashboards often attribute the full delay to the tool invocation rather than separating pre-tool sandbox/index/discovery overhead.
- Full-tree scans may be triggered by worktree/session lifecycle events rather than the user-visible tool command.

## Root-cause hypotheses
1. **Missing scan identity:** equivalent discovery operations are not deduplicated by `(repo, worktree, scope, ignore-set, filesystem state)`.
2. **Over-broad roots:** sandbox or indexing roots include dependency/generated directories that are irrelevant to the current operation.
3. **No scan budget:** hosts lack a maximum scan frequency, concurrent scanner count, or per-task filesystem-walk budget.
4. **Invalidation too coarse:** any workspace event invalidates a cached inventory instead of only affected scopes.
5. **Inactive-project leakage:** background project state is treated as active scheduling input.
6. **Poor attribution:** pre-tool scan time is merged into generic tool latency, hiding the actual bottleneck.

## Improvement target
Introduce a deterministic repository-scan guard around host filesystem discovery:

- fingerprint scan requests by repository/worktree/scope/reason;
- record start/end time, command/process identity, paths, file count, and elapsed time;
- reject or warn on duplicate equivalent scans inside a configurable cooldown window;
- enforce per-minute and concurrent-scan budgets;
- require explicit justification for full-root scans;
- maintain allow/deny scope rules for dependency/generated directories;
- separate scan overhead from actual tool execution latency;
- fail safe by blocking runaway scans rather than allowing resource exhaustion;
- provide a bounded cache with explicit invalidation events, never silent permanent caching.

## Success metrics
- scans per task;
- duplicate-equivalent scan ratio;
- scan CPU time / wall time;
- scan process count;
- bytes/files walked when observable;
- p50/p95 pre-tool scan overhead;
- p50/p95 total tool latency;
- maximum concurrent scanners;
- cache hit rate for repository inventory;
- regression rate in file-discovery correctness.

A successful rollout should reduce duplicate scans and pre-tool latency while preserving discovery correctness on a representative repository corpus.

## Observed evidence vs interpretation vs proposal

### Observed evidence
Multiple recent Codex issues report repeated repository scans, runaway scanner processes, high CPU/disk utilization, and large delays before ordinary tool operations.

### Interpretation
The recurring engineering gap is not merely 'search is slow'; it is the lack of an explicit scan budget, deduplication identity, scope policy, and scan-specific telemetry in agent hosts.

### Proposed engineering solution
This package implements a reusable scan-event analyzer and policy gate, plus host integration procedures, hooks, rules, and verification workflows. It does not claim to fix upstream Codex internals automatically; it gives platform builders a deterministic control plane for their own agent runtimes and wrappers.