# Research Evidence

## Topic
Provider Quota Admission Breaker

## Category
Performance

## Problem
Multi-agent and long-running agent systems can continue dispatching model requests after one request has already established, with machine-readable evidence, that the shared provider resource is exhausted. Each later request repeats an outcome that is already known, wasting model turns, quota, latency, retry budget, and orchestration work.

## Why it matters now
OpenAI Codex issue #39582, created 2026-08-20, proposes a resource-scoped admission gate after observing that later child/follow-up dispatches remain possible after terminal quota failure. The linked evidence from #16891 records terminal child failures whose reason was flattened to generic/no-response state and was followed by repeated parent redispatch. Separately, #30471 documents ambiguity and mismatched handling around HTTP 429 and retry semantics, showing that raw status codes alone are not a safe basis for a shared breaker.

## Affected users
Developers running multi-agent systems, background agents, CI/review agents, orchestration platforms, users with multiple model/provider resources, and teams paying per request or operating under strict quotas.

## Current public evidence

### Observed evidence
1. `openai/codex#39582` reports that after a machine-readable terminal provider exhaustion, later same-resource model requests can still be admitted. Its referenced rollout evidence reports 13 terminal child failures followed by 11 explicit follow-up dispatches targeting 7 failed child paths.
2. `openai/codex#16891` reports quota exhaustion being collapsed into a generic/no-response child result, preventing the parent from distinguishing quota failure from timeout, transport failure, or an intentional empty result.
3. `openai/codex#30471` shows that transport-level HTTP 429 behavior is not equivalent to typed quota exhaustion: provider config may not retry 429 while the surfaced message can still imply retry exhaustion. This supports requiring authoritative typed classification rather than status-string heuristics.

### Interpretation
The recurring weakness is not simply retry count. It is missing propagation of typed resource state and missing admission control between failure classification and later dispatch. A safe solution must be resource-scoped and conservative: ambiguous 403/429 responses must not trip a shared breaker.

## Existing approaches
- Per-request retry/backoff.
- User-visible rate-limit errors.
- Local token/rollout budgets.
- Goal states such as usage-limited.
- Manual model switching or waiting for reset.

## Remaining limitations
- Per-request retry makes each sibling rediscover a known terminal state.
- Generic error strings lose provider/resource identity.
- Global cancellation is too broad and can stop unrelated local/MCP work.
- Local token budgets are not provider availability signals.
- Naively treating all 429/403 as shared exhaustion can block healthy resources.

## Root-cause analysis
1. Failure classification may be flattened before orchestration receives it.
2. Provider resource identity is not consistently carried with the failure.
3. Admission checks happen independently of the latest resource state.
4. Recovery metadata such as `Retry-After` or `resets_at` is not necessarily represented as a breaker generation/cooldown.
5. Concurrency can race: a request admitted before trip detection may execute after the resource is known exhausted.

## Improvement opportunity
Introduce a deterministic resource-scoped admission breaker that accepts only authoritative typed exhaustion signals, stores resource key + generation + reset metadata, rejects later same-resource requests before network dispatch, permits unrelated resources/local tools, and uses a bounded half-open probe for recovery.

## Goal
Reduce redundant doomed model requests after confirmed provider exhaustion without falsely blocking unrelated or ambiguously classified requests.

## Metrics
- Same-resource provider requests after confirmed terminal exhaustion.
- Avoided provider calls.
- Admission decision latency.
- False-positive breaker trips.
- Half-open probe count and recovery time.
- Unrelated-resource continuation rate.
- Quota/cost consumed after first confirmed exhaustion event.

## Trigger
A typed terminal provider exhaustion event or a transient rate-limit event with authoritative retry/reset metadata.

## Inputs
Typed failure class, provider/resource identity fields, request resource key, reset/retry metadata, current breaker state, generation, and request kind.

## Outputs
`allow`, `deny`, or `probe` decision plus resource key, generation, reason, retry time, and evidence.

## Relevant sources
- https://github.com/openai/codex/issues/39582
- https://github.com/openai/codex/issues/16891
- https://github.com/openai/codex/issues/30471

## Proposed solution
The package implements a reusable admission-state model and verifier. It does not infer quota exhaustion from free-text errors and does not cancel unrelated work.