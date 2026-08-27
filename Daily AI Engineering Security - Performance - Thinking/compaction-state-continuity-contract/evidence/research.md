# Research — Compaction State Continuity Contract

**Topic:** Preserve active agent/application state across context replacement without token-reinjection thrash  
**Category:** Token  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Context compaction changes the model-visible history, but many runtimes track application state, project instructions, and deduplication separately. When the replacement history is created, logically active state may be omitted because it was "already sent" in the old window. Conversely, restoring every static instruction or registry entry in full can quickly consume the savings from compaction.

## Why it matters now
Fresh August 2026 reports in both Codex and Claude Code expose both sides of the continuity problem: active context can disappear after compaction, while re-injected static context can cause rapid refill and repeated compaction.

## Affected users
Coding-agent users, app-server/IDE integrators, agent-framework developers, platform builders with long-running sessions, and teams using large project instruction or subagent registries.

## Current public evidence

### Observed evidence
1. **OpenAI Codex issue #38269, opened August 12, 2026:** unchanged client-supplied `additionalContext` disappears after automatic compaction because the replacement history does not re-render retained values; ordinary per-turn deduplication remains valid until history replacement invalidates the assumption that previous context is still model-visible. The report includes a focused regression test and proposed fix.  
   https://github.com/openai/codex/issues/38269
2. **OpenAI Codex issue #36721, opened August 3, 2026:** proposes structured, cost-aware checkpoints plus a bounded lossless operational tail because continuation quality can suffer when compaction loses active goal, decisions, failed attempts, changed files, tests, and next action. It explicitly calls for measuring token savings and continuation fidelity.  
   https://github.com/openai/codex/issues/36721
3. **Anthropic Claude Code issue #85489, opened August 10, 2026:** reports sessions where large auto-loaded project instructions are re-injected after compaction and the context refills within a few turns, producing autocompact thrashing.  
   https://github.com/anthropics/claude-code/issues/85489
4. **Anthropic Claude Code issue #84187, opened August 5, 2026:** reports a large agent-listing attachment being resent in full after compaction, contributing tens of thousands of tokens and quickly refilling the context.  
   https://github.com/anthropics/claude-code/issues/84187

### Interpretation
These independent product signals point to a lifecycle mismatch: context data has logical lifetimes longer than one model history, while deduplication and reinjection are often optimized around ordinary turns. A compaction boundary should therefore be treated as a new context epoch with explicit rehydration and token-budget rules. This is an engineering interpretation, not a claim of identical implementation defects across products.

## Existing approaches
- Automatic context summarization/compaction.
- Per-turn deduplication for unchanged application context.
- Re-reading/re-injecting project instruction files after compaction.
- Large-context models and higher compaction thresholds.
- Manual `/compact` or session reset.
- Proposed structured continuation checkpoints and raw tails.

## Remaining limitations
- Ordinary-turn deduplication can incorrectly suppress still-active values after the old history is replaced.
- Full static reinjection is continuity-safe but may erase token savings and prompt-cache locality.
- Free-form summaries do not guarantee preservation of active constraints, failed-attempt conclusions, or next action.
- Compaction may occur mid-task, so tool call/result groups can be split unless boundaries are explicit.
- Token reduction alone is not sufficient success criteria; continuation quality can regress and cause repeated reads/tool calls.

## Root-cause analysis
1. Context lifetime (`turn`, `epoch`, `durable`) is not represented explicitly.
2. Deduplication keys against "last emitted" state rather than "present in current context epoch."
3. Rehydration lacks priority and token budgets.
4. Compaction output lacks a required continuity schema.
5. Raw operational state and summarized historical state are not separated.
6. Verification often measures context size but not semantic/operational recall after compaction.

## Improvement opportunity
Introduce an epoch-aware continuity contract. Assign a new epoch ID whenever model history is replaced. Re-render all durable active context once into the new epoch, independently of normal turn-level deduplication. Preserve a strict structured checkpoint with required operational fields plus a bounded verbatim tail of complete recent turn/tool groups. Apply token budgets to non-critical reinjection and defer low-priority context to retrieval. Validate active-context recall and budget before the next model/tool step.

## Goal
Lower token usage and compaction thrash while preserving active constraints and operational continuity.

## Metrics
- active-context recall after compaction
- tokens per checkpoint and rehydration
- context utilization after replacement
- compactions per 10 turns
- turns until next compaction
- repeated investigation/read/tool rate after compaction
- prompt-cache read/write tokens where available
- task success and regression rate

## Trigger
Any automatic/manual compaction, token-budget rollover, replacement context window, or resume from persisted compacted state.

## Inputs
Pre-compaction durable state, active constraints, context epoch ID, checkpoint, retained raw tail, post-compaction rendered context, token estimates/usage.

## Outputs
Validated replacement-context continuity decision, missing-state list, budget findings, and verification status.

## Relevant sources
- Codex #38269: https://github.com/openai/codex/issues/38269
- Codex #36721: https://github.com/openai/codex/issues/36721
- Claude Code #85489: https://github.com/anthropics/claude-code/issues/85489
- Claude Code #84187: https://github.com/anthropics/claude-code/issues/84187
