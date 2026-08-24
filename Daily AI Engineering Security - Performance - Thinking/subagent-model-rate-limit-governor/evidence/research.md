# Research — Subagent Model Rate-Limit Governor

## Topic
Per-model rate-limit collapse during parallel AI subagent fan-out

## Category
Performance

## Problem
Parallel agent orchestration can concentrate many child requests onto one default model/provider bucket. A fan-out that is logically parallel can therefore hit per-model HTTP 429 limits, cause empty child results, amplify retries, and make total task latency worse than a smaller controlled concurrency level.

## Why it matters now
Multi-agent coding workflows increasingly use parallel explore/review agents. Current August 2026 reports show that model-specific throttling can fail a whole fan-out even while the parent model remains healthy. Generic "retry later" behavior is insufficient because all children can synchronize their retries against the same constrained bucket.

## Affected users
Developers using coding-agent subagents, CI agentic workflows, platform teams operating multi-agent runtimes, and teams paying usage-based AI credits.

## Current public evidence
### Observed evidence
1. GitHub Copilot CLI issue #4416, opened 2026-08-09, reports a 16-agent `explore` fan-out concentrating requests on the same lightweight model, reaching per-model 429s within about 20 seconds; repeated rate-limit errors left children with empty output while the parent continued. https://github.com/github/copilot-cli/issues/4416
2. GitHub Copilot SDK issue #2279, opened 2026-08-06, documents an agentic workflow failing on AI-credit/rate-limit handling and recommends reducing unnecessary model/tool calls and large inputs. https://github.com/github/copilot-sdk/issues/2279
3. GitHub's current Copilot usage-limit documentation states that popular models can receive burst traffic and that frequent automated requests should adjust request patterns. https://docs.github.com/en/copilot/concepts/usage-limits

## Interpretation
The recurring engineering problem is not simply "429 exists." It is missing admission control at the orchestration layer. Parent agents commonly know desired fan-out but not the effective model bucket, current in-flight count, retry-after state, or whether a compatible fallback model exists. Without those signals, concurrency decisions are made before provider pressure is known.

## Existing approaches
- Provider/server-side rate limiting and `Retry-After` responses.
- Generic exponential backoff in SDKs.
- Static maximum parallel-agent counts.
- Manual model switching after failures.
- Usage/credit budgets at workflow level.

## Remaining limitations
- Static concurrency does not adapt to model-specific capacity.
- Independent child retries can synchronize and produce retry storms.
- Global rate limits do not capture one constrained model bucket while other eligible models remain healthy.
- Blind model fallback can change quality/capability and invalidate task assumptions.
- Many orchestrators report only terminal child failure, losing admission/retry telemetry needed to tune throughput.

## Root-cause analysis
1. Fan-out is scheduled by logical task count rather than capacity-aware model buckets.
2. Model selection is often implicit in child type, so parent scheduling lacks the true resource key.
3. Retry policy is decentralized across children.
4. `Retry-After`, 429 density, and recent successful service time are not converted into shared backpressure.
5. Fallback eligibility is not bound to capability/quality requirements.

## Improvement opportunity
Introduce a deterministic orchestration-side governor that assigns each request to a `(provider, model, credential/tenant)` bucket, enforces bounded concurrency, honors `Retry-After`, applies jittered centralized backoff, reduces concurrency after throttling, cautiously increases it after sustained success, and permits fallback only when an explicit compatibility policy allows it.

## Proposed solution
This package supplies an admission-and-feedback procedure, enforceable performance rules, a specialized investigator, a benchmark workflow, a pre-dispatch hook, and a dependency-free Python simulator/analyzer for measuring fan-out latency and 429 amplification before integrating the policy into a host runtime.

## Goal
Maximize completed useful child tasks per unit time without increasing failed calls or changing required model capability.

## Metrics
- child completion rate
- p50/p95 fan-out completion latency
- HTTP 429 count and rate
- retry attempts per successful child
- empty/failed child result rate
- peak in-flight requests per model bucket
- provider/model switches
- useful completions per 100 model requests

## Trigger
Any workflow launching more than one model-backed child concurrently, or any runtime observing 429 responses in child-agent traffic.

## Inputs
Trace events containing timestamp, child id, provider, model, status code, latency, attempt, optional `Retry-After`; policy limits; model-compatibility map.

## Outputs
Baseline report, recommended bucket concurrency, retry/backoff policy, before/after benchmark, and regression decision.

## Verification
Verified only when the same workload completes with lower 429/retry amplification and equal-or-better useful completion rate, with no forbidden model substitution and no worse p95 latency beyond the configured regression threshold.
