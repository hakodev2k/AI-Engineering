# Skill: Long-Session Context Budget Analysis

## Purpose
Measure whether a long-running agent can safely continue without context overflow, repeated compaction, or avoidable cache rewrite.

## Trigger
Before large tool output is appended, after compaction, after long idle time, or when token/cache cost rises unexpectedly.

## Inputs
Current context tokens, pending user/tool/retrieval tokens, context limit, cache read/write tokens, idle time, recent latency, and task-quality checks.

## Preconditions
Telemetry is recent and belongs to the same session.

## Required context
Task requirements and correctness-critical state. Do not remove required security or acceptance criteria.

## Allowed tools
Usage telemetry, trace logs, `scripts/context_budget_guard.py`, benchmark/test results.

## Constraints
MUST NOT claim savings without before/after measurements. MUST NOT discard context required for correctness solely to reduce cost.

## Procedure
1. Capture baseline tokens/request, latency, cache-read ratio, compaction count, and quality checks.
2. Compute projected next-request usage including pending tool/retrieval/user additions.
3. Apply safety margin and minimum-runway policy.
4. Record Facts, Assumptions, Evidence, Hypotheses, Decision, Risks, Verification status.
5. Run the deterministic guard.
6. If checkpoint/compaction is recommended, preserve goals, acceptance criteria, unresolved hypotheses, security constraints, and verification state.
7. Measure again after the action.
8. Compare token usage, latency, cache reuse, and quality.

## Decision points
Continue only below soft budget with adequate runway. Compact/checkpoint on soft budget, low cache reuse, or long-idle risk. Start a new session with checkpoint when projected usage exceeds the window.

## Expected output
Machine-readable continuation decision plus before/after metrics.

## Metrics
Tokens/task, tokens/request, cache-read ratio, cache-creation tokens, latency, compactions/hour, post-compaction runway, quality regression rate.

## Verification
Run task-specific tests and confirm checkpoint retains all critical requirements.

## Failure handling
Fallback to conservative checkpoint/compact when telemetry is incomplete.

## Stop conditions
Maximum two optimization iterations. Stop if quality regresses, telemetry is inconsistent, or required context cannot be represented safely.
