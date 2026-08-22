# Skill: Fork Context Analysis

## Purpose
Measure the byte/token risk of inherited agent history and derive a correctness-preserving fork context plan.

## Trigger
Before full-history fork/subagent creation, after repeated WebSocket/request failures on a fork, or when session storage growth is disproportionate to child work.

## Inputs
Parent rollout JSONL or normalized records, fork mode, context byte/token budgets, minimum recent-turn retention, critical record types, optional quality checks.

## Preconditions
History is read-only during analysis. Record ordering and types can be parsed. Sensitive payload content need not be persisted in reports.

## Required context
Latest effective compaction semantics, fork purpose, context budget, required recent suffix, and whether binary payloads can be referenced instead of inlined.

## Allowed tools
Read-only file streaming, JSON parsing, hashing, token estimators, deterministic analyzer, benchmark/replay harness.

## Constraints
- MUST preserve correctness-critical instructions, latest effective compacted state, and required post-compaction suffix.
- MUST NOT delete or rewrite the canonical parent history as part of optimization.
- MUST NOT remove security/approval context solely to save tokens.
- SHOULD hash large inline payloads without logging their contents.

## Procedure
1. Measure parent bytes and record counts by type.
2. Identify `compacted` records and determine the latest effective compacted state.
3. Measure historical compacted bytes superseded by later compactions.
4. Detect repeated large strings/data URLs by content hash and count duplicate bytes.
5. Measure records after the latest effective compaction; preserve the required suffix.
6. Estimate inherited bytes/tokens for full-history versus compacted-effective projection.
7. Compare both plans against configured budgets.
8. If the safe projection exceeds budget, require a narrower fork scope or human decision; do not silently discard required context.
9. Run quality/coverage verification on representative tasks before adopting the optimized fork policy.

## Decision points
- No compaction records: deduplicate only demonstrably repeated binary payloads or narrow fork scope.
- Latest effective projection within budget: permit optimized fork.
- Budget exceeded but critical context cannot be reduced: block full-history fork and escalate.
- Quality regression: reject optimization.

## Expected output
Structured metrics, duplicate/superseded byte report, proposed inherited record set, budget decision, and verification status.

## Metrics
Inherited bytes/fork, estimated tokens/fork, superseded-compaction bytes, duplicate binary bytes, child storage growth, request latency, reconnect/retry count, task quality/coverage, regression rate.

## Verification
Compare baseline full-history and optimized fork on the same task. Accept only when bytes/tokens decrease materially, no critical context is lost, and quality remains within configured tolerance.

## Failure handling
Keep the canonical history untouched, fall back to a bounded recent-context fork, or block fork creation. Maximum two optimization attempts.

## Stop conditions
Verified safe projection, no meaningful savings, quality regression, unparseable history, or two failed optimization attempts.