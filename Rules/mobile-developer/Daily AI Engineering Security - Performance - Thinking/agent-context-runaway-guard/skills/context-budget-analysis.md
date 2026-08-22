# Skill: Context Budget Analysis

## Purpose
Identify which context components cause repeated compaction, high token cost, low headroom, or oversized persisted sessions.

## Trigger
Context >= trigger ratio, repeated compaction, abnormal session-file growth, slow post-tool continuation, or large image/tool ingestion.

## Inputs
Context JSON/JSONL export, actual provider token count when available, context window, compaction/turn counts, required-facts checklist.

## Preconditions
Sensitive data is handled locally or redacted; analysis does not upload raw secrets.

## Required context
Context structure and task-critical facts only.

## Allowed tools
`profile_context.py`, `check_budget.py`, local file inspection, provider usage metrics.

## Constraints
Do not delete task-critical facts. Do not infer image cost as zero. Do not claim token savings from character estimates when actual provider usage is available.

## Procedure
1. Capture baseline: actual input tokens if available, context window, utilization, headroom, compaction count, latency, persisted bytes.
2. Run the profiler to measure data URLs, tool output, duplicate payloads, and text.
3. Rank contributors by removable cost and correctness risk.
4. Classify each item: retain verbatim, summarize, reference/retrieve on demand, truncate, deduplicate, or evict.
5. Preserve a required-facts ledger containing goal, constraints, decisions, unresolved issues, approvals, changed files, and verification state.
6. Apply one bounded compaction/selection strategy.
7. Re-profile and run the post-compaction budget gate.
8. Compare required-facts ledger before/after. If facts are missing, restore them even if token target worsens.

## Decision points
- Payload dominates but is reloadable → replace inline content with reference/metadata.
- Repeated identical payload → deduplicate.
- Post-compaction headroom below minimum → compaction failed; diagnose instead of immediately looping.
- Required fact lost → correctness failure; reject optimization.

## Expected output
Before/after profile, top contributors, retention decisions, budget result, required-facts regression status.

## Metrics
Tokens/task, utilization, headroom, compactions/10 turns, payload bytes, duplicate chars, latency, required-fact retention.

## Verification
Use actual provider token usage when possible and deterministic required-facts checks. A separate verifier reviews optimization claims.

## Failure handling
Maximum two compaction attempts. Then stop, preserve evidence, and use a controlled fresh-session handoff if necessary.

## Stop conditions
Target utilization and minimum headroom met with all required facts retained, or retry limit reached.
