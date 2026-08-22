# Research — Token Telemetry Semantics Guard

## Topic
Ambiguous and inaccurate token telemetry in long-running AI-agent sessions can cause wrong compaction decisions, misleading context-pressure diagnostics, and poor cost/performance investigations.

## Category
Token

## Problem
Agent systems often expose several token concepts through similarly named fields: current/last-turn context usage, cumulative session usage, cached input, and locally estimated usage. If these values are conflated or an estimate overwrites a measured value, operators and automated compaction logic can make incorrect decisions.

## Why it matters now
Several fresh August 2026 Codex issues independently report token-semantic confusion and estimation drift. One report shows lifetime `total_token_usage` surfacing as `tokens_used`, which can be mistaken for active context occupancy. Another requests raw context token counters because cumulative used tokens diverge after compaction. A third reports a bytes/4 estimate overwriting measured last-turn usage after compaction, with non-ASCII sessions especially vulnerable to estimator error.

## Affected users
AI-agent platform engineers, coding-agent users, observability teams, context-management implementers, model gateways, and teams tuning compaction/cost controls.

## Current public evidence
### Observed evidence
1. Codex issue #38154, opened 2026-08-12, reports Desktop/thread `tokens_used` reflecting lifetime `total_token_usage` rather than active-context usage, making long threads appear over context when the last turn fits: https://github.com/openai/codex/issues/38154
2. Codex issue #36786, opened 2026-08-03, requests distinct raw current-context counters because cumulative `used-tokens` diverges from active context after compaction: https://github.com/openai/codex/issues/36786
3. Codex issue #37135, opened 2026-08-05, reports a bytes/4 recomputation overwriting measured `last_token_usage` after compaction and shifting auto-compaction decisions, especially for non-ASCII sessions: https://github.com/openai/codex/issues/37135
4. Earlier Codex issue #22354 also documents how cumulative `total_token_usage` is easy to misread as current context and asks for clearer semantic aliases: https://github.com/openai/codex/issues/22354

## Existing approaches
- Show a single `tokens_used` field.
- Display context percentages without raw counters.
- Estimate tokens locally from byte or character length when provider usage is unavailable.
- Recompute usage after compaction.
- Use cumulative provider usage for billing/accounting.

## Remaining limitations
- Field names do not always encode whether values are current-turn or lifetime cumulative.
- A local approximation may silently replace provider-measured data.
- Estimator error varies by language/content and can be materially worse for non-ASCII text.
- Compaction logic may consume telemetry that was intended only for display or billing.
- Operators often lack provenance indicating whether a token count is measured, estimated, reconstructed, or cumulative.

## Root-cause analysis
1. Token telemetry mixes multiple semantic dimensions in one flat namespace.
2. Measurement provenance is not mandatory.
3. Current-context occupancy and cumulative consumption use overlapping terminology.
4. Estimated values can overwrite measured values instead of being stored separately.
5. Automated decisions lack sanity checks against context-window bounds and monotonic cumulative counters.

## Improvement opportunity
Define a canonical telemetry contract separating `current_context_tokens`, `session_cumulative_tokens`, `cached_input_tokens`, `model_context_window`, and `measurement_source`. Preserve measured and estimated values independently; calculate estimator error when both exist; prevent estimated values from replacing measured values; and block context-management decisions when telemetry semantics are ambiguous or bounds are violated.

## Goal
Make token telemetry safe for automated context decisions and understandable for humans without losing cumulative cost/accounting data.

## Metrics
- 100% token counters carry explicit semantic names and measurement provenance.
- 0 estimated values overwrite measured values.
- 100% context-management decisions use current-context counters, not cumulative session totals.
- Estimator relative error is measured whenever both measured and estimated counts exist.
- Context occupancy never exceeds the configured window without a flagged inconsistency.

## Trigger
New token event, compaction, session resume, provider-usage update, local token estimate, or UI/automation consuming a token counter.

## Inputs
JSON/JSONL token events, context-window size, measurement source, optional measured and estimated counts, cached-token counters.

## Outputs
Normalized telemetry report, semantic/provenance violations, estimator-error metrics, and blocking status for unsafe automation inputs.

## Interpretation
These public reports demonstrate real operational ambiguity and implementation bugs; they do not prove every agent framework has the same defect. The reusable problem is the absence of a strict token-telemetry contract at the boundary between measurement, display, billing, and context-management automation.

## Proposed solution
A canonical schema, deterministic validator/analyzer, operational rules, and verification workflow that keep current context, cumulative usage, cache usage, and estimates separate.

## Relevant sources
- https://github.com/openai/codex/issues/38154
- https://github.com/openai/codex/issues/36786
- https://github.com/openai/codex/issues/37135
- https://github.com/openai/codex/issues/22354
