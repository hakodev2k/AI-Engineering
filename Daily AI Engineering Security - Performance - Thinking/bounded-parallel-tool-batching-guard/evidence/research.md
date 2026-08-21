# Research Evidence

## Topic
Bounded Parallel Tool Batching Guard

## Category
Token

## Problem
Code-mode agents can serialize independent tool calls even when the runtime supports nested concurrency. Every unnecessary outer model/tool cycle reprocesses a large context, increasing cached-input tokens, wall-clock latency, and quota-weighted usage.

## Why it matters now
OpenAI Codex reports updated through 2026-08-20 show this in GPT-5.6 Sol code-mode workflows. One controlled report found explicit bounded batching reduced model cycles by about 52–55%, raw tokens by about 53–63%, and weighted usage by 27–45% on repeated read-heavy tasks. An earlier independent trace found only 5 of 739 exec cells used Promise.all and observed much higher model-turn and token processing per tool-bearing turn.

## Affected users
Developers running repository investigations, coding agents using Code Mode/Responses Lite, teams paying per-token or subject to usage quotas, and agent-platform builders exposing nested tool runtimes.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #35050 reports controlled comparisons across two unrelated codebases. Batched runs had 52.1–54.7% fewer model cycles, 52.6–63.1% lower raw tokens, and 27–45% lower weighted usage in repeated High/XHigh comparisons. The issue also warns that an overly aggressive batching instruction consumed 26.8% more weighted credits than its control, showing that concurrency needs bounded eligibility rather than blanket parallelism.
2. OpenAI Codex issue #32503 independently analyzed a long session and found GPT-5.6 Sol used Promise.all in only 5/739 exec cells (~0.7%). The report ties the Responses Lite/code-mode interface to disabled native top-level parallel calls while nested Promise.all remains supported.

## Existing approaches
- Generic model instruction to prefer parallelism.
- Manual prompt/AGENTS.md instruction to use Promise.all/Promise.allSettled.
- Runtime support for nested concurrent calls.
- Post-hoc inspection of session logs.

## Remaining limitations
Generic parallelism language does not reliably identify which calls are safe to batch. Blind batching can expand investigation scope, combine approval-sensitive operations, hide partial failures, or increase usage. Existing guidance also lacks deterministic telemetry that distinguishes outer cycles, nested calls, eligible-but-serialized groups, and unsafe candidates.

## Root-cause analysis
The practical concurrency primitive changed from native top-level batches to model-authored JavaScript inside exec, but the tool interface did not provide equally concrete eligibility rules. The model therefore tends to emit one nested call per outer exec. Without dependency classification, a simple “parallelize more” rule can also batch calls that are adaptive, mutating, conflicting, approval-sensitive, or unnecessary.

## Improvement opportunity
Add an observable batching contract: classify planned calls by dependency and side-effect risk; batch only independent read-only calls inside a bounded stage; use allSettled when partial results are useful; measure outer cycles and token usage before/after; and fail regression verification when task coverage drops or usage rises materially.

## Relevant sources
- https://github.com/openai/codex/issues/35050
- https://github.com/openai/codex/issues/32503
- https://github.com/openai/codex/blob/main/codex-rs/code-mode-protocol/src/description.rs
- https://github.com/openai/codex/blob/main/codex-rs/core/tests/suite/code_mode.rs

## Interpretation
The evidence supports a concrete token/performance problem in read-heavy agent tasks. It does not prove every workload benefits from batching; implementation-heavy, approval-sensitive, or adaptive tasks may correctly remain sequential.

## Proposed solution
A reusable bounded batching gate with baseline measurement, dependency classification, deterministic log analysis, safe batching rules, and before/after verification.