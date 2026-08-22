# Skill: Batching Analysis

## Purpose
Identify independent tool calls that can be safely grouped without changing task semantics.

## Trigger
Use for tool-heavy tasks with repeated read/search/metadata calls or when outer model cycles dominate token/latency cost.

## Inputs
Planned calls with tool name, arguments, read/write classification, dependencies, approval requirements, and expected outputs; baseline session metrics.

## Preconditions
A baseline exists. Call semantics are known. Writes and irreversible actions can be identified.

## Required context
Task goal, dependency graph, permission boundaries, stop conditions, and quality criteria.

## Allowed tools
Read-only repository/file/search tools, session-log readers, deterministic analyzers, benchmark runners.

## Constraints
Do not batch dependent calls, conflicting mutations, approval-sensitive actions, waits/resumes, or adaptive investigations where one result changes the next call. Do not add calls merely because capacity exists.

## Procedure
1. Record baseline outer cycles, nested calls, input/output tokens, latency, failures, and task coverage.
2. Label each planned call: read-only/read-write, independent/dependent, adaptive/static, approval/no-approval.
3. Build bounded stages. Calls in one stage may run concurrently only when all are independent and non-conflicting.
4. Prefer allSettled when partial results remain useful; use fail-fast semantics only when every member is required.
5. Execute the same task scope with batching enabled.
6. Compare metrics and coverage to baseline.
7. If weighted usage or latency regresses by >10%, inspect scope expansion and stage composition before one retry.
8. Stop after two optimization attempts.

## Decision points
- Any dependency or write conflict: keep sequential.
- Any approval requirement: keep sequential around the approval boundary.
- Partial failures useful: allSettled semantics.
- Quality/coverage regression: reject optimization.

## Expected output
Batch plan, eligibility rationale, baseline/optimized metrics, coverage comparison, accepted/rejected decision.

## Metrics
Outer model cycles, nested calls per outer cycle, serialized eligible groups, input/cached/output tokens, weighted usage where available, p50/p95 task latency, tool-error rate, coverage score.

## Verification
Optimization passes only when task coverage is unchanged or improved and at least one target metric improves without material regression elsewhere.

## Failure handling
Revert to sequential execution for ambiguous stages; preserve evidence; retry optimization at most twice.

## Stop conditions
No eligible parallel groups, quality regression, security/approval ambiguity, or two failed optimization attempts.