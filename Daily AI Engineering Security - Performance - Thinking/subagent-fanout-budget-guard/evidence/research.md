# Research — Subagent Fan-out Budget Guard

## Topic
Token/latency amplification caused by parallel AI-agent fan-out.

## Category
Performance

## Problem
Parallel subagents can multiply inherited context, compaction, retries, tool calls, and duplicated work. Nominal concurrency may therefore worsen total task time/cost and exhaust quotas without proportional throughput.

## Why it matters now
Multi-agent coding workflows are increasingly common and 2026 issue reports include measured, high-impact amplification cases across more than one agent platform.

## Affected users
Developers running coding-agent teams, orchestration platforms, CI agents, research/review fan-outs, and teams with quota/cost constraints.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #33196, opened 2026-07-15, reports two parallel review subagents showing nearly identical repeated context processing: roughly 340M cumulative tokens per subagent in about two minutes, more than 2,200 token-count events each, 10 compactions each, and an aggregate cumulative count around 1.4B.
2. Claude Code issue #56068 reports four parallel subagents inheriting large parent context, including one child consuming 106K tokens for work the reporter expected could be done with a simple grep under much lower token usage. The issue is closed as duplicate but remains an independent field signal.
3. Claude Code issue #45660 reports analysis across 55 projects/298 sessions where an internal subagent duplicated the full session and accounted for 55% of one 398M-token session.
4. Claude Code issue #80253, opened 2026-07-22, reports workflow subagents retrying from blank context after session-limit errors, rereading the same files and repeating already-completed work.
5. Codex issue #36557, opened 2026-08-02, reports full parent-session history copied into child rollout files with measured quadratic disk growth; this is storage evidence for the same context-duplication pattern, not direct proof of model input billing.

### Interpretation
Parallelism is only beneficial when useful work gained exceeds context/retry/coordination amplification. A fixed concurrency cap does not capture this because four small independent children and four full-context children have very different cost profiles.

### Proposed solution
Use a deterministic pre-spawn budget gate that estimates inherited context + expected child work + bounded retry exposure, checks concurrency and aggregate limits, rejects obvious duplicate delegation, and reconciles prediction against observed usage.

## Existing approaches
- fixed max child/concurrency counts;
- step/time limits;
- manual cost monitoring;
- isolated subagent context;
- retry policies;
- compaction.

## Remaining limitations
- concurrency caps ignore context size;
- cost dashboards may expose amplification only after it occurred;
- retries can restart from cold context;
- children may receive overlapping assignments;
- compaction/replay can dominate bounded work;
- actual child usage may be missing from parent-level telemetry.

## Root-cause analysis
1. Parent context inheritance/reconstruction is multiplied by fan-out.
2. Delegation boundaries are semantic, so duplicate work is not always detected.
3. Retry policies often count attempts but not repeated context cost.
4. Token/cost telemetry may be fragmented by child session.
5. Parallelism is optimized for elapsed time without an aggregate resource budget.

## Improvement opportunity
Treat subagent spawning as a resource-allocation decision. Estimate before spawn, cap the worst-case bounded retry cost, prefer deterministic tools for simple searches, and feed observed usage back into future estimates.

## Metrics
Aggregate tokens, child tokens, wall-clock latency, useful-output count, duplicated assignments, retries, compactions, amplification ratio `(aggregate child tokens)/(serial baseline tokens)`, and predicted-versus-actual error.

## Relevant sources
- https://github.com/openai/codex/issues/33196
- https://github.com/anthropics/claude-code/issues/56068
- https://github.com/anthropics/claude-code/issues/45660
- https://github.com/anthropics/claude-code/issues/80253
- https://github.com/openai/codex/issues/36557

## Evidence status
**Implemented:** deterministic pre-spawn budget calculation is supplied.

**Measured:** the package does not claim universal savings until baseline/adoption traces are collected.

**Verified:** requires unit tests plus before/after workload comparison.