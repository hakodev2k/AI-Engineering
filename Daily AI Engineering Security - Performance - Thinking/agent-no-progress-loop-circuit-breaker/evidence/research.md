# Research — Agent No-Progress Loop Circuit Breaker

## Problem
Long-running coding agents can enter repeated action cycles that consume tokens and wall-clock time without producing new durable progress. Typical signatures include reading the same file/offset repeatedly, emitting nearly identical continuation messages, re-running the same inspection tool, or resuming after compaction only to repeat the same pre-action sequence.

## Category
**Thinking** — reliability of planning/execution loops through explicit progress evidence, bounded repetition, stop conditions, and recovery.

## Why it matters now
Recent public reports show this failure mode across multiple coding-agent products and workflows. The common gap is not simply model quality; hosts often lack a deterministic, external definition of progress and therefore keep accepting repeated actions as valid work.

## Current public signals

### Claude Code #86291 — repeated Read loop after compaction
Opened 2026-08-13. The report describes Claude Code repeatedly reading the same file offset after compaction and failing to make progress.
Source: https://github.com/anthropics/claude-code/issues/86291

### Codex #37800 — automatic continuation consumed tokens without progress
Opened 2026-08-10. A long-running task repeatedly emitted only a continuation status message after genuine earlier progress, consuming usage without additional edits or meaningful work.
Source: https://github.com/openai/codex/issues/37800

### Codex #34322 — compaction/resume loop
Opened 2026-07-20. After conversation optimization, the agent resumed with near-identical status messages, re-read the same files, compacted again, and repeated.
Source: https://github.com/openai/codex/issues/34322

### Codex #34248 — unbounded goal auto-continuation
Opened 2026-07-20. Goal auto-continuation generated repeated turns without progress while an external condition remained blocked.
Source: https://github.com/openai/codex/issues/34248

### Codex #27588 — pre-write compaction loop
Opened 2026-06-11. A task repeatedly re-read instructions/state, compacted, reconnected, and restarted the same sequence for hours without reaching file edits.
Source: https://github.com/openai/codex/issues/27588

## Existing approaches
1. **Prompt-level instructions such as "avoid loops" or "continue until done".** Easy to add, but the same model that is looping must recognize its own lack of progress.
2. **Global turn/tool-call limits.** Prevent infinite execution, but treat productive long runs and useless repetition identically.
3. **Timeouts.** Bound wall-clock duration but do not detect high-frequency token burn or repeated state transitions.
4. **Manual user intervention.** Effective after detection, but unsuitable for unattended and scheduled agents.
5. **Compaction/checkpointing.** Helps context size, but multiple reports show compaction can itself be part of a repetition cycle when progress state is not preserved.

## Observed limitations
- Repetition is often semantically obvious but not represented as an explicit machine-checkable state.
- Token/turn budgets detect cost, not whether progress occurred.
- Simple duplicate-string matching misses equivalent tool calls with harmless argument changes.
- Any circuit breaker that only counts repeated calls risks blocking valid pagination, polling, tests, or bounded retries.
- Recovery is weak when the agent is merely told to “try again”; it may replay the same trajectory.

## Root-cause hypotheses
1. The runtime has no durable progress ledger separate from conversational text.
2. Auto-continuation interprets non-final assistant output as evidence that more work is useful.
3. Compaction preserves narrative summaries but not enough machine-verifiable trajectory state.
4. Repeated tool outcomes do not trigger a host-level novelty threshold.
5. Blocked external conditions are not converted into explicit wait/stop states.

## Improvement target
Introduce a deterministic trajectory guard that computes progress from observable events rather than hidden reasoning. The guard records normalized action fingerprints and durable progress markers, then evaluates sliding windows for repetition and novelty.

A healthy loop should provide one or more of:
- new files/regions inspected;
- new evidence identifiers or distinct tool results;
- repository mutations or changed test outcomes;
- task-state transitions;
- hypothesis elimination or explicit blocker transitions;
- bounded retries with changed parameters.

A suspicious loop has repeated action fingerprints, repeated result fingerprints, and no durable progress markers beyond configurable thresholds.

## Proposed engineering solution
- Normalize each tool/action event into a stable fingerprint.
- Track progress markers separately from messages.
- Compute action repetition ratio, result repetition ratio, novelty ratio, and turns-since-progress.
- WARN before STOP so transient retries can recover.
- On STOP, require a structured recovery checkpoint: facts, repeated trajectory, blocker, changed hypothesis, next materially different action, or explicit escalation.
- Never auto-resume the exact stopped trajectory without a changed recovery key.

## Success metrics
- runaway-loop fixtures stopped within configured maximum no-progress turns;
- productive repeated operations (pagination, bounded polling, test retries) remain allowed through explicit progress markers/allowances;
- false-stop rate measured on representative successful traces;
- tokens/tool calls after the first detectable loop reduced versus unguarded baseline;
- every stop contains machine-readable evidence explaining which thresholds fired;
- recovery either changes the trajectory or exits/escalates within a bounded number of attempts.

## Evidence classification
**Observed evidence:** public issue reports describe repeated actions/messages and token/time consumption without progress.

**Interpretation:** a host-level progress definition and trajectory breaker can reduce damage even when the underlying model/runtime bug remains.

**Proposed solution:** this package’s fingerprinting, progress ledger, thresholds, hooks, and recovery workflow.

## Sources
- https://github.com/anthropics/claude-code/issues/86291
- https://github.com/openai/codex/issues/37800
- https://github.com/openai/codex/issues/34322
- https://github.com/openai/codex/issues/34248
- https://github.com/openai/codex/issues/27588
