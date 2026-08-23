# Research

## Topic
Model-aware admission for background memory generation

## Category
Token

## Problem
Background memory jobs can ingest more transcript content than the target model can safely accept. A deterministic context overflow is then treated like a transient job failure, wasting quota/retries and creating silent holes in durable memory.

## Why it matters now
Codex memory generation is now used in long-running desktop/CLI workflows, where the most valuable sessions are also the largest and most tool-heavy.

## Affected users
Agent users with long sessions, platform builders running background summarization/memory, and teams measuring quota/cost or durable-memory completeness.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #38860, opened 2026-08-16, reports 95/309 `memory_stage1` jobs failed (30.7%); 92 failures were context-window errors, 93 had exhausted retries, and failed sessions contributed no stage-1 output. https://github.com/openai/codex/issues/38860
2. Codex issue #36806, opened 2026-08-03, reports whole session transcripts submitted without a per-transcript ceiling, causing context-window failures after input/quota consumption. https://github.com/openai/codex/issues/36806
3. Codex issue #35093, opened 2026-07-24, identifies a 4-bytes/token approximation in stage-1 truncation; JSON, code and punctuation-heavy text can tokenize more densely and exceed the nominal token budget. https://github.com/openai/codex/issues/35093
4. Codex issue #36736 reports oversized background memory jobs being rescheduled with backoff while idle, burning tokens repeatedly. https://github.com/openai/codex/issues/36736

## Existing approaches
Fixed transcript truncation, retry budgets/backoff, rough bytes-per-token conversion, and background execution that hides failures from the foreground session.

## Remaining limitations
Byte length is not a reliable token count; unchanged deterministic overflow does not benefit from retry; all-or-nothing stage-1 loses the most substantial sessions; foreground success can mask incomplete memory coverage.

## Root-cause analysis
1. Admission happens too late, after model dispatch.
2. Input capacity is approximated without explicit headroom for system instructions/output.
3. Retry classification does not distinguish deterministic capacity errors from transient transport/model errors.
4. Memory coverage is not treated as an independently verified result.

## Interpretation
The public evidence is Codex-specific, but the engineering failure mode applies to any asynchronous LLM pipeline that summarizes historical transcripts against a bounded model context.

## Improvement opportunity
Preflight every memory job against a model-aware budget and generate bounded chunk ranges before dispatch. Preserve the source; route deterministic oversize to a different strategy rather than burning retries.

## Proposed solution
`memory_admission.py` counts UTF-8 bytes, derives a conservative token estimate from configurable bytes/token, reserves fixed/system/output headroom, and returns either `admit` or a deterministic chunk plan. Hosts can replace the estimator with provider token counts while retaining the admission contract.

## Metrics
Estimated/provider input tokens, context utilization, admitted/blocked ratio, overflow retries avoided, chunks/session, memory artifacts/session, memory coverage percentage, quota per successful artifact.

## Trigger / Inputs / Outputs
Trigger: before background memory extraction/summarization. Inputs: rollout file and policy. Outputs: admission decision, capacity, estimated tokens, chunk ranges and reason.
