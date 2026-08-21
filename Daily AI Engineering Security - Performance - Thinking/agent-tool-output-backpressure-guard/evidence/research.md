# Research — Agent Tool-Output Backpressure Guard

**Research date:** 2026-08-20 (UTC+7)  
**Category:** Performance (primary), with Token and reliability implications.

## Problem

AI coding agents and multi-agent runtimes frequently persist or replay shell/tool/subagent output. When output volume is unbounded, duplicated, eagerly embedded into session history, or replayed in full during resume, one verbose or looping tool can consume disk, memory, context, CPU, and recovery time far beyond the useful information contained in the output.

The engineering problem is not merely “truncate stdout.” A useful guard must preserve diagnostic value while bounding storage and replay costs, detect abnormal growth early, avoid silently discarding correctness-critical evidence, and make large artifacts retrievable by reference rather than repeatedly embedding them into the active session.

## Why it matters now

Recent 2026 reports show this failure mode at production-like scale: tens of gigabytes, hundreds of gigabytes, and even terabytes of temporary task output; session resume hangs from oversized persisted tool results; and renderer OOM during large-session loading. The pattern appears across long-running agents, subagents, background tasks, web fetches, verbose commands, and loops that repeatedly print errors.

## Current public signals

### Signal 1 — unbounded Task output reaches hundreds of GB

Anthropic Claude Code issue #39909 (opened 2026-03-27) reports three `.output` files consuming about 95 GB, including two 40+ GB subagent aggregation files and a 5 GB interactive prompt loop. The issue explicitly requests a size cap or stop-capture behavior.

Source: https://github.com/anthropics/claude-code/issues/39909

### Signal 2 — recurring 500+ GB accumulation

Claude Code issue #26911 (opened 2026-02-19) reports a single research-heavy session producing 537 GB of task-output files and repeated disk-full emergencies. The reporter notes no TTL, no session cleanup, and no size cap for the task output directory.

Source: https://github.com/anthropics/claude-code/issues/26911

### Signal 3 — 278 GB in minutes

Claude Code issue #41737 (opened 2026-04-01) reports two task-output files growing to 232 GB and 46 GB in roughly minutes, filling a 926 GB drive to 99%. The report suggests output-size caps, cleanup, monitoring, and deduplication.

Source: https://github.com/anthropics/claude-code/issues/41737

### Signal 4 — 1.4 TB single task output

Claude Code issue #35121 (opened 2026-03-17) reports a single temporary task output file growing to 1.4 TB and filling disk, with the suspected trigger being runaway stdout/stderr during multi-step or parallel task execution.

Source: https://github.com/anthropics/claude-code/issues/35121

### Signal 5 — resume hangs even after a persisted-output mechanism is present

Claude Code issue #21067 (opened 2026-01-26) reports `claude --resume` hanging indefinitely when a session contains a large tool result. The report notes that a persisted-output marker existed, but the full content was still embedded in session state, defeating the purpose of persistence-by-reference.

Source: https://github.com/anthropics/claude-code/issues/21067

### Signal 6 — large session transcript causes renderer OOM

Claude Code issue #67613 (opened 2026-06) reports the desktop Code tab crashing when loading a roughly 2.4 GB session JSONL into the renderer, exceeding the effective heap ceiling.

Source: https://github.com/anthropics/claude-code/issues/67613

### Signal 7 — parallel subagent output can drive memory growth

Claude Code issue #81265 (opened 2026-07-25) reports unbounded desktop memory growth during parallel subagent sessions until the webview is OOM-killed around 20 GB process-tree RSS. The reporter calls for memory caps/backpressure and shedding buffered data for warm/hidden sessions.

Source: https://github.com/anthropics/claude-code/issues/81265

## Existing approaches

1. **Full capture to temp files.** Preserves data but fails if file growth is unbounded or cleanup is missing.
2. **Hard truncation.** Bounds size but can lose the only error line, final test summary, or security-relevant evidence.
3. **Persist large output to disk.** Better than embedding, but insufficient when the full output is still duplicated into session history or eagerly replayed.
4. **Conversation compaction.** Reduces model context but does not necessarily reduce disk/memory pressure from raw tool artifacts.
5. **Manual cleanup.** Works after the incident, but is reactive and unsuitable for unattended agents.
6. **Command-specific quiet flags.** Useful when known ahead of time, but cannot protect arbitrary external tools or prompt loops.
7. **OS disk quotas / temp cleanup.** Coarse-grained and may protect the machine while still allowing the agent run to fail abruptly without useful diagnostics.

## Observed limitations

- Most controls are applied after output is already generated or persisted.
- File-size-only caps ignore output velocity, session-wide accumulation, and duplicate content.
- Naive truncation can destroy the exact tail section that explains failure.
- Eager resume/replay can turn an old storage problem into a new latency or OOM problem.
- Repeated subagent/tool results may be copied into several places: temp file, transcript, parent context, UI buffer.
- Cleanup without content-addressing makes it hard to know which artifacts are still referenced.
- A large-output incident can trigger retries, causing even more output and duplicate side effects.

## Root-cause hypotheses

1. **No explicit output budget contract.** Tools inherit effectively unlimited stdout/stderr capture.
2. **Capture and model-context concerns are coupled.** The runtime treats “retain full artifact” and “inject full artifact into context” as the same decision.
3. **No backpressure signal.** Producers continue printing even after consumers are saturated.
4. **No session-wide accounting.** Per-tool output looks acceptable while the aggregate session grows without bound.
5. **No velocity detector.** Infinite or near-infinite loops are only noticed when disk/memory is already exhausted.
6. **No reference-first persistence.** Large payloads are duplicated instead of represented as `{digest, path, bytes, preview}`.
7. **Resume is eager.** Historic large artifacts are deserialized/rendered even when not immediately needed.

## Improvement target

Introduce a deterministic host-side output guard with these behaviors:

- track bytes per stream, per tool, and per session;
- track output rate over a sliding interval;
- preserve bounded **head + tail** previews rather than only prefixes;
- compute SHA-256 over captured full artifacts when full persistence is enabled;
- persist oversized artifacts once and replace active-session content with a stable reference;
- reject or stop capture at configurable hard limits;
- emit explicit reason codes such as `PER_TOOL_HARD_LIMIT`, `SESSION_HARD_LIMIT`, or `RATE_LIMIT`;
- make replay lazy: load previews by default, full artifacts only when explicitly requested;
- audit session files for oversized records and duplicated persisted payloads;
- never silently drop output required for correctness: mark truncation and require targeted retrieval when verification depends on omitted data.

## Success metrics

- maximum bytes captured per tool remain within configured hard limit;
- maximum session-resident tool-output bytes remain within configured session limit;
- output-rate violations are detected before disk/memory emergency thresholds;
- large payloads appear once in artifact storage and as references in session state;
- resume-time p95 and peak RSS improve on representative large-output fixtures;
- retained head/tail previews preserve terminal error/success summaries for supplied fixtures;
- no tool result is silently truncated: every clipped result includes deterministic metadata;
- regression tests pass for unlimited-output simulations, duplicate payloads, and large-history audits.

## Interpretation vs proposed solution

### Observed evidence

Multiple 2026 reports independently show unbounded tool-output growth, giant session files, resume hangs, and OOM behavior. Existing persistence mechanisms can still fail when large payloads are duplicated into session state.

### Interpretation

The missing abstraction is an explicit **output budget and backpressure boundary** between tool execution, artifact retention, session persistence, UI replay, and model context.

### Proposed engineering solution

This package provides a provider-neutral output-budget policy, a deterministic stream guard, a session-bloat auditor, bounded workflows, integration hooks, and regression tests. It does not claim to fix provider-internal runtimes; it gives agent hosts and wrappers a reusable containment layer that can be measured independently.