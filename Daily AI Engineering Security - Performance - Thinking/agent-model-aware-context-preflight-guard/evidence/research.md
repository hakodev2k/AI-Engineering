# Research — Model-Aware Context Preflight Guard

**Run date:** 2026-08-20 (UTC+7)  
**Category:** Token

## Problem

AI-agent runtimes frequently decide whether a rendered request fits a model context window using stale usage counters, coordinator-model limits, byte/character heuristics, or estimates made before templates/tool metadata are appended. Token-dense JSON, source code, punctuation, non-ASCII text, tool schemas, and mixed-model subagents can therefore exceed the real input budget even when a nominal budget check passed. The inverse problem also occurs: bad accounting can compact too early, discard useful context, or waste quota.

## Why it matters now

Recent public reports show the failure class across multiple agent runtimes rather than as a single application bug.

### Signal 1 — Codex memory truncation uses an unsafe bytes/token approximation

OpenAI Codex issue #35093, opened 2026-07-24, reports memory stage-1 failures with `context_length_exceeded` because a token budget is converted with a fixed `4 bytes/token` heuristic. The report specifically notes JSON, source code, and punctuation-heavy content can tokenize more densely, and also points out that the final prompt/template is added after rollout truncation.

Source: https://github.com/openai/codex/issues/35093

### Signal 2 — Codex post-compaction accounting can overwrite measured usage with the same approximation

Codex issue #37135, opened 2026-08-05, reports that a bytes/4 estimate can replace measured token usage after compaction, shifting later auto-compaction decisions, especially for non-ASCII sessions. This demonstrates that estimation errors can affect both hard context failures and control-loop decisions.

Source: https://github.com/openai/codex/issues/37135

### Signal 3 — Oversized background transcripts fail after consuming quota

Codex issue #36806, opened 2026-08-03, reports memory generation submitting large transcripts with no effective per-transcript ceiling, repeatedly producing context-window errors after input processing and consuming quota without useful output. It also highlights weak local accounting for background token usage.

Source: https://github.com/openai/codex/issues/36806

### Signal 4 — Mixed-model subagents can use the wrong context limit

Claude Code issue #83355, opened 2026-08-02, reports subagent auto-compaction using the main session's context window instead of the subagent model's smaller window, so the subagent is not compacted before the provider rejects the request.

Source: https://github.com/anthropics/claude-code/issues/83355

### Signal 5 — Context accounting regressions are externally visible

Claude Code issue #71301 reports `/context` over-counting memory files and agent metadata in one version, showing that incorrect accounting can also trigger unnecessary compaction or misleading operational decisions.

Source: https://github.com/anthropics/claude-code/issues/71301

## Existing approaches

1. **Fixed byte/character heuristics** — fast and dependency-free, but content-dependent error can be large.
2. **Last provider-reported usage** — authoritative for the previous request, but stale after new user/tool/context content is appended.
3. **Coordinator/session model limit** — simple in homogeneous systems, wrong in mixed-model delegation.
4. **Automatic truncation/compaction** — useful recovery, but only if triggered using the correct model and final rendered request size.
5. **Provider/tokenizer counting** — most accurate when available. Provider responses expose measured token usage, and some providers expose preflight token-count capabilities; however, callers still need to count the fully rendered request and reserve output/reasoning/tool overhead.
6. **Conservative fallback estimates** — necessary when exact tokenization is unavailable, but they must fail closed near the context boundary and be calibrated from measured traffic rather than a universal constant.

OpenAI's Realtime API documentation explicitly describes context truncation relative to the model input-token limit and reserved output capacity, reinforcing that request budgeting must consider the full effective context rather than raw text size alone: https://platform.openai.com/docs/api-reference/realtime-client-events/session

## Observed limitations

- Counting is often performed before final prompt rendering.
- Static templates, tool definitions, retrieved context, system instructions, images/other modalities, and reserved output can be omitted from the budget.
- Previous-turn usage is reused even though new content has been appended.
- Byte/character ratios vary significantly by language and structure.
- Multi-agent systems can inherit the wrong model's context window.
- Retry loops may repeatedly submit an oversized request instead of changing the input.
- Many systems do not record estimate-vs-measured error, so heuristics never improve.

## Root-cause hypotheses

1. Token budgeting is treated as a text-truncation helper instead of a request-admission control boundary.
2. The runtime lacks one canonical `RenderedRequest -> BudgetDecision` stage immediately before the provider call.
3. Model identity and context-limit metadata are not carried through delegation.
4. Estimation and measured usage are conflated; provenance of a token count is lost.
5. Retry policy does not classify `context_length_exceeded` as a deterministic input-shape failure.

## Improvement target

Introduce a reusable **model-aware context preflight guard** that:

- operates on the final rendered request artifact;
- requires explicit model identity and model-specific input window;
- reserves output/reasoning/tool overhead before admitting input;
- prefers an exact/provider tokenizer counter;
- supports calibrated conservative fallback only when exact counting is unavailable;
- blocks or routes to a deterministic reduction workflow before provider invocation;
- never retries the identical oversized payload;
- records `source = exact | measured | estimated`, estimate error, headroom, and reduction actions;
- verifies with token-dense regression fixtures and replayed production-shaped samples.

## Success metrics

- `context_length_exceeded` caused by local budgeting: **0** in the verification corpus.
- Identical oversized-request retries: **0**.
- Preflight decision coverage: **100%** of model calls.
- Model identity coverage: **100%** of calls and delegated subagent calls.
- Exact-counter coverage target: **>= 95%** when provider/local tokenizer support exists.
- Fallback estimate under-count rate at the configured safety margin: **0** in the calibration corpus.
- Unnecessary reduction rate and retained-context ratio are measured, not assumed.

## Interpretation vs proposal

**Observed evidence:** the cited issues and provider documentation above.  
**Interpretation:** these reports share a request-admission/accounting failure class despite different runtimes.  
**Proposed engineering solution:** the guard, policy, workflows, hooks, scripts, and tests in this package. The package does not claim upstream products implement this design.
