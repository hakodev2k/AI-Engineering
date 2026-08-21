# Research — Agent Repeated Context-Injection Dedup Guard

## Problem
Long-running coding-agent sessions can repeatedly inject identical or near-identical host-generated context—rules, system reminders, hook results, file-change attachments, task reminders, IDE events, and side-channel metadata—into subsequent model turns. The payload grows even when little new information is added, consuming context window, cache capacity, latency, and cost.

## Category
**Token**

## Why it matters now
Multiple 2026 Claude Code reports independently describe repeated context injection as a measurable, recurring production problem rather than a hypothetical prompt-design concern.

## Current public signals

### Signal 1 — repeated JSONL attachments caused linear payload growth
Anthropic Claude Code issue #50998 (opened 2026-04-20) documents repeated `attachment`, `last-prompt`, `progress`, hook results, IDE events, task reminders, and subagent side-events being reconstructed into later prompts. The reporter measured payload growth of roughly 1,100 tokens/minute, reaching 661,706 tokens in 148 minutes, with auto-compaction not eliminating the recurring payload.

Source: https://github.com/anthropics/claude-code/issues/50998

### Signal 2 — path-scoped rules re-injected after tool calls
Claude Code issue #32057 reports path-scoped rules being emitted repeatedly as `<system-reminder>` content after tool calls. The report measured roughly 93K tokens of repeated rules over about 30 tool calls, around 46% of a 200K context window.

Source: https://github.com/anthropics/claude-code/issues/32057

### Signal 3 — full file contents repeatedly injected after edits
Claude Code issue #43410 reports file-change system reminders repeatedly injecting full file contents and accumulating across turns, with one session reaching 692K tokens.

Source: https://github.com/anthropics/claude-code/issues/43410

### Signal 4 — task reminders create context noise
Claude Code issue #45986 reports TaskCreate/TaskUpdate reminders firing every few tool calls even for work that does not benefit from task tracking, adding context noise and consuming tokens.

Source: https://github.com/anthropics/claude-code/issues/45986

### Signal 5 — repeated reminders in headless mode
Claude Code issue #27599 reports large `<system-reminder>` blocks being attached to subsequent user messages after edits, repeatedly carrying surrounding file lines.

Source: https://github.com/anthropics/claude-code/issues/27599

## Observed evidence
- Identical or substantially overlapping host-generated context can recur over many turns.
- The repeated payload may survive normal session continuation and can regrow after resets.
- Auto-compaction addresses total history size but does not necessarily eliminate a producer that keeps injecting the same content again.
- Repetition is not limited to one source: rules, file reminders, task reminders, hook attachments, and side-events have all been reported.

## Interpretation
The host needs an explicit context-admission layer for generated attachments. Context should be treated as a stream of versioned facts, not an append-only transcript. If a payload is unchanged, it should normally be referenced, suppressed, or represented by a compact freshness marker rather than fully reinjected.

## Existing approaches

### Auto-compaction / manual `/compact`
Useful for compressing accumulated conversation history.

**Observed limitation:** issue #50998 reports the repeated host-generated material reappearing after compaction, because the producer continues to emit new attachment records.

### `/clear` or restarting sessions
Provides a temporary reset.

**Observed limitation:** issue #50998 reports rapid re-accumulation after resets.

### Prompt caching
Reduces billing/latency for stable prefixes.

**Limitation:** changing appended attachment records can move the cache boundary and still consumes context-window capacity even when billing is partly cached.

### Manually reducing rules/hooks/plugins
Can lower baseline context.

**Limitation:** it requires users to remove useful functionality and does not solve duplicate injection by the runtime.

## Root-cause hypotheses
1. Host-generated context is modeled as append-only events rather than stateful/versioned facts.
2. Producers lack stable content identifiers or fingerprints.
3. Every tool result can trigger fresh serialization of unchanged rules/reminders.
4. Context builders optimize for completeness but do not enforce per-source token budgets or deduplication windows.
5. Compaction occurs downstream of injection, so the same payload is regenerated after compaction.
6. Semantic overlap is not measured; slightly changed wrappers defeat exact-string deduplication.

## Proposed engineering solution
A reusable **Context Injection Dedup Guard** at the host/context-builder boundary:

1. Normalize host-generated attachments while preserving correctness-critical fields.
2. Compute a stable SHA-256 fingerprint for exact duplicate detection.
3. Track source, logical key, version, first-seen turn, last-seen turn, token estimate, and payload size.
4. Admit full content on first sight or explicit version change.
5. Suppress exact duplicates within a configurable freshness window.
6. For same logical key with modified content, emit the new version and retire the previous active version.
7. Never silently suppress required safety policy, user input, current tool results, error details needed for recovery, or content marked `always_include`.
8. Emit measurable metrics: injected tokens, suppressed tokens, duplicate ratio, unique-version ratio, source distribution, and quality-regression test result.

## Improvement target
Compared with the baseline context builder on a representative transcript:
- reduce host-generated repeated context tokens by at least 30%;
- achieve exact-duplicate suppression precision of 100% on deterministic fixtures;
- preserve every `always_include` event;
- preserve first occurrence and every content-version change;
- introduce zero task-answer regressions in the supplied golden-context tests;
- keep guard processing under 5 ms/event p95 for payloads under 256 KB on a typical developer workstation;
- produce no unbounded state growth by enforcing ledger retention limits.

## Safety/correctness boundaries
The guard MUST NOT deduplicate:
- user messages;
- current tool result payloads unless the tool protocol explicitly marks them idempotent/replayable;
- authentication/authorization decisions;
- safety policy updates;
- current error/recovery information;
- content whose source marks `always_include=true`;
- a new version of a logical context item.

## Success state model
- **Implemented:** deterministic normalization, fingerprinting, admission policy, ledger persistence, metrics, and tests exist.
- **Measured:** baseline and guarded token metrics are collected on the same fixture/session.
- **Verified:** regression fixtures confirm required context is retained and duplicate tokens fall without correctness loss.

## Sources
1. Anthropic Claude Code #50998, 2026-04-20: https://github.com/anthropics/claude-code/issues/50998
2. Anthropic Claude Code #32057: https://github.com/anthropics/claude-code/issues/32057
3. Anthropic Claude Code #43410, 2026-04-04: https://github.com/anthropics/claude-code/issues/43410
4. Anthropic Claude Code #45986, 2026-04-10: https://github.com/anthropics/claude-code/issues/45986
5. Anthropic Claude Code #27599, 2026-02-22: https://github.com/anthropics/claude-code/issues/27599
