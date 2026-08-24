# Research — Effective Context Compaction Budget Calibrator

## Topic
Effective context accounting and compaction-threshold calibration.

## Category
Token

## Problem
Long-running AI agents can compact too late or too early because raw model window, usable window after reserves, prompt occupancy, reasoning occupancy, cache accounting, and compaction trigger can diverge.

## Why it matters now
Fresh August 2026 Codex reports show opposite failure modes: one says auto-compaction waits until 94.7% of usable context because the raw window is used; another says GPT-5.6 all-turns reasoning is double-counted and compaction can trigger with roughly 20% context remaining.

## Affected users
Developers running long agent sessions, platform builders implementing compaction, teams routing across models, and operators responsible for token cost and latency.

## Current public evidence
### Observed evidence
1. OpenAI Codex #40095, opened 2026-08-22: default auto-compaction reportedly derives its limit from the raw context window, leaving less effective headroom than intended. https://github.com/openai/codex/issues/40095
2. OpenAI Codex #39767, opened 2026-08-20: GPT-5.6 all-turns reasoning is reportedly double-counted, causing auto-compaction with substantial context still remaining. https://github.com/openai/codex/issues/39767
3. Pi coding-agent changes in August 2026 corrected token-total accounting and compaction boundary handling, independently showing that token categories and compaction timing are implementation-sensitive. https://github.com/badlogic/pi-mono

### Interpretation
The engineering problem is not merely choosing a better percentage; it is ensuring numerator and denominator use the same semantics and are validated against observed prompt usage.

### Proposed solution
Maintain a model-aware effective-context snapshot, subtract explicit reserves, compare runtime-counted occupancy against observed prompt occupancy, and block rollout when accounting error or headroom violates policy.

## Existing approaches
Static window percentages, provider usage fields, runtime token estimators, automatic compaction, and manual overflow recovery.

## Remaining limitations
Provider fields classify cached/reasoning tokens differently; raw percentages ignore reserves; estimators can drift from serialized requests; one threshold cannot safely cover heterogeneous models; premature compression can reduce quality.

## Root-cause analysis
Quantity mismatch; token-category overlap; hidden reserves; model metadata drift; missing independent validation.

## Improvement opportunity
Treat context budgeting as a calibrated measurement system rather than a static constant.

## Goal
Predictable compaction headroom with fewer unnecessary compactions and no task-quality regression.

## Metrics
Accounting error ratio, headroom ratio, compactions/task, overflow recoveries/task, tokens/task, latency/task, quality regression rate.

## Trigger
Model/runtime upgrade, policy change, unexplained token spike, or early/late compaction report.

## Inputs
Raw window, reserves, observed prompt tokens, runtime-counted tokens, compaction trigger, representative traces.

## Outputs
Calibration verdict, violations, effective usable context, before/after measurements.

## Relevant sources
- https://github.com/openai/codex/issues/40095
- https://github.com/openai/codex/issues/39767
- https://github.com/badlogic/pi-mono
