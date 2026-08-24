# Research

## Topic
Cross-surface session convergence for AI coding agents

## Category
Thinking

## Problem
The same AI coding session can diverge across desktop, CLI, mobile, web, and remote-control surfaces. A surface may omit persisted turns, restore an older selected child, or lose remote registration while canonical state still exists.

## Why it matters now
Remote-control and multi-surface coding workflows are now common. In August 2026, both OpenAI Codex and Anthropic Claude Code users reported concrete cross-surface state divergence that can cause an agent to reason from stale history or overwrite newer state.

## Affected users
Developers using mobile/desktop handoff, remote control, CLI/desktop switching, multi-thread tasks, and platform teams implementing resumable agent sessions.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #37620, opened 2026-08-08: mobile turns existed in the canonical thread but were omitted from the next Desktop model context. https://github.com/openai/codex/issues/37620
2. OpenAI Codex issue #39945, published 2026-08-21: a stale client restored an older selected child even though the newer child rollout remained intact. https://github.com/openai/codex/issues/39945
3. Anthropic Claude Code issue #85435, opened 2026-08-10: after restart, a local session's remote-control bridge was not re-registered, leaving mobile/web stale or invisible. https://github.com/anthropics/claude-code/issues/85435
4. Anthropic Claude Code issue #85285, opened 2026-08-09: a live macOS Desktop session was missing or frozen on iOS and Dispatch session APIs. https://github.com/anthropics/claude-code/issues/85285

### Interpretation
These are distributed-session consistency failures, not merely rendering bugs. Canonical history, selected-child state, writer ownership, and remote registration can evolve independently. A model or tool runner that trusts one stale surface can continue from the wrong state.

## Existing approaches
Stable session IDs, warm resume, local caches, writer locks/leases, bridge registration, and server-side transcript persistence.

## Remaining limitations
Session identity does not prove freshness; selected-child pointers can be stale while transcript bytes are correct; bridge registration can drift independently; UI and context builders can observe different generations; retries often restore availability without proving convergence.

## Root-cause analysis
1. Decision-critical state dimensions are versioned independently or not at all.
2. Resume logic may trust local pointers before re-reading authority state.
3. Writer ownership and bridge registration have different lifecycles.
4. No universal pre-resume invariant requires a common generation.
5. Recovery focuses on reconnecting, not proving convergence.

## Improvement opportunity
Introduce a pre-resume gate that compares canonical version, durable turn, selected child, writer identity, and registration epoch. Block write-capable continuation on divergence, reconcile with bounded retries, and require independent verification.

## Goal
Prevent continuation from stale cross-surface state.

## Metrics
Mismatch count by dimension, durable-turn lag, writer conflicts, reconciliation success, recurrence, and stale continuations blocked.

## Trigger
Resume, handoff, remote attach, restart restore, device switch, or selected-child restore.

## Inputs
Canonical snapshot plus one or more surface snapshots.

## Outputs
PASS/BLOCK, mismatch list, lag metrics, and reconciliation evidence.

## Relevant sources
- https://github.com/openai/codex/issues/37620
- https://github.com/openai/codex/issues/39945
- https://github.com/anthropics/claude-code/issues/85435
- https://github.com/anthropics/claude-code/issues/85285

## Proposed solution
This package implements observable state comparison and bounded recovery without requesting or exposing hidden chain-of-thought.