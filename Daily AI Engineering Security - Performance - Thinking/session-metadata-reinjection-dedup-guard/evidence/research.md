# Research

## Topic
Session Metadata Reinjection Dedup Guard

## Category
Token

## Problem
Long-running coding-agent sessions can persist transient metadata such as hook results, reminders, progress records, snapshots, repeated prompts, bootstrap files, and subagent side-events. When history reconstruction re-includes redundant persisted metadata on later model turns, prompt size can grow faster than the actual useful conversation, increasing token cost, latency, compaction pressure, and context-loss risk.

## Why it matters now
Current 2026 issue reports show the problem in multiple agent runtimes. A detailed Claude Code report measured repeated JSONL attachments and prompt copies accumulating across long sessions despite `/clear` and compaction. OpenClaw reports independently describe bootstrap/context content being reinjected and context accounting causing premature compaction. These are implementation-specific signals of a broader reusable engineering problem: persisted session state needs lifecycle, deduplication, and per-turn inclusion policy rather than "persist everything, replay everything."

## Affected users
Developers running long-lived coding-agent sessions, teams using hooks/plugins/subagents, agent-runtime maintainers, platform engineers measuring model cost, and users of smaller context-window models.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #50998 documents repeated context injection from session JSONL attachments, hook results, task reminders, `last-prompt`, file-history snapshots, and subagent progress. The report measured a continuously used session growing to 661,706 prompt tokens (66% of a 1M context window) in 148 minutes, with repeated metadata and compaction not materially shrinking subsequent payload. Source: https://github.com/anthropics/claude-code/issues/50998
2. OpenClaw issue #67419 reports bootstrap files consuming 20–30% of context and being re-injected on follow-up turns, motivating a separation between stable/bootstrap context and per-turn dynamic context. Source: https://github.com/openclaw/openclaw/issues/67419
3. OpenClaw issue #118772 reports inflated `sessionEntry.totalTokens` from cumulative multi-tool-loop usage causing premature compaction at a small fraction of configured context. Although the immediate bug is accounting, it demonstrates that persisted/session token telemetry can diverge from actual current prompt size and drive harmful compaction decisions. Source: https://github.com/openclaw/openclaw/issues/118772
4. OpenClaw issue #43603 describes long-running agent sessions becoming sluggish or timing out near high context utilization, reinforcing the operational impact of unmanaged session growth. Source: https://github.com/openclaw/openclaw/issues/43603

## Existing approaches
- Automatic context compaction/summarization.
- Manual `/clear` or new sessions.
- Prompt caching.
- Context-window warnings and token counters.
- Persist all session events for recovery/debugging.
- Smaller bootstrap files or modular prompt loading.

## Remaining limitations
Compaction can summarize conversational content while leaving replayable transient metadata intact. `/clear` may retrigger hooks or preserve the same session identity. Prompt caching reduces repeated billing only when prefixes remain stable and does not recover context capacity. Raw token counters often do not explain which persisted event classes are consuming the window, and deleting all metadata risks losing correctness-critical state.

## Root-cause analysis
- Persistence and prompt-inclusion lifecycles are conflated: "must be stored" becomes "must be sent every turn."
- Transient events lack expiry, supersession, or one-shot semantics.
- Repeated semantically identical records are stored as distinct JSONL entries.
- Stable bootstrap/context and dynamic per-turn context are not budgeted separately.
- Compaction may target conversation messages but not plugin/hook/session metadata.
- Token telemetry can represent cumulative usage instead of current reconstructed prompt size.

## Improvement opportunity
Add a deterministic session profiler and inclusion contract that classifies persisted records as durable, superseding, one-shot, or ephemeral; identifies exact/near duplicate payloads; measures per-class bytes/tokens; enforces per-turn metadata budgets; and verifies that deduplication/eviction preserves required state. Keep persistence for audit/recovery while preventing redundant replay into every model call.

## Interpretation
The public reports are product-specific and do not prove every agent runtime has the same defect. They do show independent implementations suffering from session-state growth, repeated context inclusion, and misleading token accounting. A generic profiler and lifecycle policy is reusable across JSONL/event-sourced agent runtimes.

## Proposed solution
A package that measures session JSONL composition before optimization, fingerprints repeated payloads, marks superseding/ephemeral event classes, creates a replay working set, applies explicit token/byte budgets, and verifies result quality and required-state retention before accepting savings.

## Goal
Reduce redundant session metadata included in model prompts without removing context required for correctness, recovery, safety, or user intent.

## Metrics
- Prompt/session metadata bytes by event class.
- Exact duplicate bytes and duplicate ratio.
- Estimated replay bytes before/after deduplication.
- Metadata budget utilization.
- Tokens/task and latency/task where provider telemetry is available.
- Quality/regression pass rate after optimization.
- Required-state retention rate: 100% for protected event classes.

## Trigger
Long-lived session growth, repeated compaction, rising cache creation, unexplained token cost, slow first-token latency, or agent-runtime changes to session persistence/history reconstruction.

## Inputs
Session JSONL, event-class policy, protected/superseding/ephemeral class definitions, optional tokenizer estimate, task quality fixtures, and before/after provider usage telemetry.

## Outputs
Composition report, duplicate groups, removable/superseded candidates, budget decision, replay working-set recommendation, and verification evidence.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/50998
- https://github.com/openclaw/openclaw/issues/67419
- https://github.com/openclaw/openclaw/issues/118772
- https://github.com/openclaw/openclaw/issues/43603
