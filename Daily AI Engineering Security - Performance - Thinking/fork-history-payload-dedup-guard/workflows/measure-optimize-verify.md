# Workflow: Measure, Optimize, Verify Fork History

## Trigger
Before a large full-history fork, after abnormal child storage growth, or after request failures associated with inherited history size.

## Goal
Reduce inherited token/storage cost while preserving the effective model-visible state and correctness-critical context.

## Inputs
Parent rollout, byte/token budgets, fork purpose, minimum recent-turn suffix, critical-context checklist.

## Baseline
Capture total parent bytes, record counts, compacted bytes, duplicate large-payload bytes, estimated inherited bytes/tokens, fork creation latency, and task quality baseline.

## Context
Append-only archival records and current effective model-visible state are not necessarily the same thing. Earlier compaction snapshots may be superseded by later compacted state.

## Stages
1. **Observe** — collect parent/fork metrics without modifying history.
2. **Measure baseline** — run `scripts/fork_history_analyzer.py`.
3. **Diagnose** — identify superseded compaction bytes and repeated large payloads.
4. **Form hypothesis** — define an effective projection: latest compacted record plus required suffix, or bounded recent history when no compaction exists.
5. **Implement in orchestrator** — configure fork selection/reference behavior; do not edit canonical parent rollout.
6. **Measure again** — compare inherited bytes/tokens, child storage, latency, and retries.
7. **Quality verification** — Context Verifier compares required-context checklist and representative outputs.
8. **Complete** — adopt optimization only if savings and quality gates pass.

## Responsible agent
Fork orchestrator implements; `subagents/context-verifier.md` independently verifies.

## Tools
Streaming JSONL analyzer, hashing/token estimator, benchmark/replay harness, storage metrics.

## Outputs
Baseline report, optimized projection plan, before/after metrics, verification decision.

## Checkpoints
Before fork creation; after projection selection; after representative replay; before production rollout.

## Metrics
Bytes/fork, estimated tokens/fork, compacted bytes, superseded bytes, duplicate payload bytes, child storage growth, p50/p95 latency, retry/disconnect rate, task coverage, regression rate.

## Retry policy
At most two optimization iterations. The second must change a measurable hypothesis; repeated identical retries are prohibited.

## Stop conditions
Quality regression, unresolved required context, budget still exceeded after two attempts, parse failure, or verified successful optimization.

## Failure path
Use a bounded recent-context fork or require human choice between broader context and resource risk. Preserve canonical history.

## Verification
Savings MUST be measured; critical-context coverage MUST remain complete; representative task quality MUST stay within the configured tolerance; no security/approval context may be lost.

## Definition of Done
Baseline documented; root cause quantified; optimized fork projection implemented outside canonical history; before/after metrics collected; independent verification passes; no blocking context-loss risk remains.