# Research — Provider Backpressure Classification Gate

## Topic
Classify LLM capacity/backpressure signals before retry, wait, or fallback

## Category
Performance

## Problem
Agent runtimes often collapse HTTP 429/503/529 and provider-specific capacity codes into one generic retry path. That can cause rapid retries during a local admission lease, pointless credential/model fallback, failure to use a configured fallback chain, or thundering-herd amplification during burst-rate controls.

## Why it matters now
Recent 2026 reports show multi-agent workloads failing or wasting retries because temporary local admission pressure, upstream provider capacity, burst-rate controls, and persistent dependency outages require different recovery actions.

## Affected users
Agent users, multi-agent platform builders, gateway operators, teams running local OpenAI-compatible routers, and services with provider fallback chains.

## Current public evidence
### Observed evidence
1. Hermes Agent issue #76468 (2026-08-01) reports `503 chat_admission_busy` plus `Retry-After` being treated as generic overload; retries/fallback occur inside the same local capacity window even though waiting for the active heavy request would resolve it. https://github.com/NousResearch/hermes-agent/issues/76468
2. Hermes Agent issue #68771 (2026-07-21) reports 666 provider 503s during capacity waves while 5xx did not trigger a configured fallback chain, causing user-visible failures after same-provider retries. https://github.com/NousResearch/hermes-agent/issues/68771
3. DeerFlow issue #4290 (2026-07-19) describes provider burst-rate limiting where immediate retries re-enter the same burst window and make the thundering herd worse. https://github.com/bytedance/deer-flow/issues/4290
4. Hermes Agent issue #55540 (2026-06-30) requests longer/configurable backoff for 503/529 overload because short fixed backoff repeatedly exhausts before transient capacity recovers. https://github.com/NousResearch/hermes-agent/issues/55540
5. Hermes Agent issue #86109 (2026-08-14) reports auxiliary-task 503 capacity failures exhausting retries without consulting the configured fallback chain. https://github.com/NousResearch/hermes-agent/issues/86109

## Interpretation
The problem is recovery-policy misclassification, not merely insufficient retries. A local admission signal should usually wait for capacity; an upstream capacity wave may justify fallback; burst-rate controls need jittered ramp suppression; a persistent unhealthy dependency should trip a circuit breaker. One generic retry loop cannot express these distinctions safely or efficiently.

## Existing approaches
- Fixed retry counts and exponential backoff.
- Generic handling for 429 or 5xx.
- Provider/model fallback chains.
- `Retry-After` support in some clients.
- Circuit breakers and concurrency limits.

## Remaining limitations
- HTTP status alone does not identify the recovery class.
- Structured provider error codes are frequently discarded by generic adapters.
- Retry and fallback decisions may be made in different layers with inconsistent policy.
- Local admission pressure can be made worse by fallback or credential rotation.
- Burst-rate controls need coordinated smoothing, not synchronized retries.

## Root-cause analysis
1. Error normalization loses structured code, scope, and `Retry-After` metadata.
2. Retry policy is keyed only by status class.
3. Multiple retry-capable layers act independently.
4. Capacity scope (local process, provider, model, account) is unknown at decision time.
5. Cumulative wait/token/attempt budgets are not shared across retries and fallback.

## Improvement opportunity
Insert a deterministic classification layer before any retry/fallback action. Preserve status, provider code, scope hints, and `Retry-After`; classify into local-admission wait, provider-capacity fallback, burst-rate smoothing, rate-limit wait, transport retry, or hard failure. Enforce one cumulative recovery budget and jittered delays.

## Proposed solution
This package provides an evidence-driven classification skill, enforceable recovery rules, independent verifier, bounded workflow, a pre-retry hook, a no-dependency classifier script, and regression tests.

## Goal
Reduce wasted retries and user-visible failures while preserving correct fallback behavior and avoiding retry amplification.

## Metrics
Attempts/turn, 429/503/529 retry count, `Retry-After` compliance, fallback success rate, cumulative recovery latency, duplicate retry layers detected, request burst coefficient, P95 completion latency, and capacity-related terminal failure rate.

## Trigger
Immediately after a model/gateway request returns a retryable-looking capacity, rate-limit, or overload signal and before any retry, credential rotation, model fallback, or workflow abort.

## Inputs
HTTP status, structured error code/type/message, `Retry-After`, provider/model identity, local-vs-upstream scope hint, attempt count, elapsed recovery time.

## Outputs
Deterministic action (`wait`, `fallback`, `backoff`, `fail`), bounded delay, reason code, and evidence record.

## Verification
Verified when replay fixtures produce the intended recovery class, delays honor policy bounds, local-admission cases do not trigger pointless fallback, provider-capacity cases can use configured fallback, and retry amplification metrics improve versus baseline.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/76468
- https://github.com/NousResearch/hermes-agent/issues/68771
- https://github.com/bytedance/deer-flow/issues/4290
- https://github.com/NousResearch/hermes-agent/issues/55540
- https://github.com/NousResearch/hermes-agent/issues/86109
