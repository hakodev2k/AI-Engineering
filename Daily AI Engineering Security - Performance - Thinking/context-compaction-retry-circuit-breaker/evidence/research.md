# Research — Context Compaction Retry Circuit Breaker

**Topic:** self-amplifying context-compaction retries
**Category:** Token
**Research date:** 2026-08-28 (UTC+7)

## Problem
Automatic context compression can fail deterministically when its own summary request is already too large. If recovery retries the same or a larger payload, especially after persisting retry diagnostics, the session can enter a non-converging loop that burns tokens and remains unresponsive.

## Why it matters now
Recent public issues show the failure mode in multiple agent runtimes, including a fresh August 2026 report in Prime Agent and large token-loss reports in coding-agent runtimes.

## Affected users
Developers running long-lived coding agents, agent-platform teams, multi-agent orchestrators, and users paying for repeated context reconstruction.

## Current public evidence
### Observed evidence
1. PrimeIntellect `prime-agent` issue #900, opened 2026-08-08, reports a long-running session entering a self-amplifying compaction loop: provider context rejection, oversized one-shot summary, retry of the same oversized request, persisted retry/output diagnostics, and repetition on later prompts. https://github.com/PrimeIntellect-ai/prime-agent/issues/900
2. Anthropic Claude Code issue #41198, opened 2026-03-30, reports five compaction agents within five minutes while idle, each carrying roughly 200K tokens, with an estimated ~1M tokens consumed. https://github.com/anthropics/claude-code/issues/41198
3. NousResearch Hermes Agent issue #556 reports context-compression retries with no backoff/progress feedback and asks for a bounded compression-attempt counter and clear terminal failure. https://github.com/NousResearch/hermes-agent/issues/556
4. Hermes Agent issue #61761, opened 2026-07-10, describes an output-cap retry path that may not converge because per-retry input-token drift erases the intended margin. https://github.com/NousResearch/hermes-agent/issues/61761

### Interpretation
The recurring systems problem is a missing convergence contract: each automatic retry should prove it is smaller or materially different from the prior failing request. Durable failure debris and generic retry logic can violate that invariant.

## Existing approaches
Automatic summarization/compaction, context truncation, retry counters, provider backoff, manual fresh sessions, lower output caps, and larger context windows.

## Remaining limitations
Retry caps limit damage but do not make retries useful; backoff does not fix deterministic overflow; blind truncation can lose correctness-critical facts; failure artifacts can enlarge later summaries; larger windows only defer the problem; manual restarts lose continuity unless summaries are verified.

## Root-cause analysis
1. Compaction recovery reuses generic retry machinery rather than a context-specific state machine.
2. No monotonic-shrink invariant is enforced.
3. Failed-attempt artifacts may be persisted into the history being compacted.
4. Equivalent failures are not fingerprinted.
5. Output reserve/headroom is calculated too late or too tightly.
6. Stop conditions and progress reporting are weak.

## Improvement opportunity
Add a deterministic circuit breaker that reserves output headroom before compaction, requires every retry to shrink by a minimum amount, excludes durable retry debris, fingerprints failures, caps attempts, records before/after token evidence, and falls back to a verified fresh continuation when convergence cannot be proven.

## Goal
Make compaction recovery bounded, measurable and monotonically convergent.

## Metrics
Retries per recovery, input-token delta per retry, tokens burned on failed recovery, recovery success rate, fresh-continuation rate, post-recovery task-quality regression.

## Trigger
Any context-limit failure, failed compaction request, or repeated compaction with unchanged failure fingerprint.

## Inputs
Context limit, current input tokens, output reserve, previous attempt size, failure fingerprints, and retry-debris token count.

## Outputs
`allow_retry`, `stop_and_continue_fresh`, or `block_invalid_state` with reason codes.

## Relevant sources
- https://github.com/PrimeIntellect-ai/prime-agent/issues/900
- https://github.com/anthropics/claude-code/issues/41198
- https://github.com/NousResearch/hermes-agent/issues/556
- https://github.com/NousResearch/hermes-agent/issues/61761
