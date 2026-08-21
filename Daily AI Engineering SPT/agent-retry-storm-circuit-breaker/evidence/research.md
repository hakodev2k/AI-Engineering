# Research — Agent Retry-Storm Circuit Breaker

**Research date:** 2026-08-20 (UTC+7)  
**Category:** Performance

## Problem

Long-running AI agents can enter retry storms where the same or near-identical operation is repeated without measurable progress. The failure may occur at the model loop, tool-call layer, permission stream, workflow watchdog, HTTP client, or subagent restart boundary. Because each layer can independently retry, total attempts multiply and consume latency, tokens, API quota, external-service capacity, and sometimes money while producing no useful state change.

## Affected users

- developers running unattended coding or research agents;
- platform teams building agent runtimes and tool orchestration;
- users with expensive or stateful tools;
- teams operating multi-agent workflows where child retries trigger parent retries.

## Why it matters now

Recent 2026 issue reports show repeated calls lasting from dozens of attempts to hours, with large token and quota impact. These are not only provider HTTP retries: several are orchestration-level failures where the model/harness retries an operation that is semantically unchanged.

## Current public signals

### Signal 1 — repeated identical tool calls

Claude Code issue #59318, opened 2026-05-15, reports the same command repeated 30–50+ times during exploratory work. The reporter describes tasks expected to take 2–3 minutes running for 1–2 hours until manually interrupted.

Source: https://github.com/anthropics/claude-code/issues/59318

### Signal 2 — permission-request stream retry amplification

Claude Code issue #75510, opened 2026-07-08, reports a broken permission-request stream retried about 128 times with no visible backoff after `Stream closed`, consuming the turn/token budget on a dead stream.

Source: https://github.com/anthropics/claude-code/issues/75510

### Signal 3 — watchdog restart loop

Claude Code issue #85206, opened 2026-08-09, reports a workflow watchdog killing an actively working subagent and restarting it from scratch. Four attempts repeatedly re-explored the repository and consumed roughly 580k tokens with zero lines of code written.

Source: https://github.com/anthropics/claude-code/issues/85206

### Signal 4 — long-lived usage drain

Claude Code issue #81359, opened 2026-07-26, reports session restart storms and long-lived tool loops draining plan usage while generating disproportionately large agent output relative to user input.

Source: https://github.com/anthropics/claude-code/issues/81359

### Signal 5 — classic retry guidance remains relevant above the HTTP layer

AWS retry guidance recommends exponential backoff with jitter, retry caps, idempotency, fail-fast handling for non-transient failures, and avoiding retries at multiple stack layers because compounded retries create retry storms.

Sources:
- https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/retry-backoff.html
- https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_mitigate_interaction_failure_limit_retries.html
- https://docs.aws.amazon.com/sdkref/latest/guide/feature-retry-behavior.html

OpenAI's API reference exposes request IDs and rate-limit headers that can be recorded as runtime evidence when diagnosing retry behavior.

Source: https://platform.openai.com/docs/api-reference

## Existing approaches

1. **SDK-level automatic retries.** Useful for transient transport and throttling failures.
2. **Prompt instructions such as “do not repeat yourself.”** Low-cost, but model compliance is not deterministic.
3. **Fixed maximum attempts.** Prevents infinity, but does not distinguish useful retry from no-progress repetition.
4. **Timeout/watchdog restart.** Recovers hung work, but can erase useful progress and repeatedly restart expensive setup.
5. **Human interruption.** Effective but unsuitable for unattended runs and reacts after waste already occurred.
6. **Generic exponential backoff.** Reduces request pressure but does not detect semantic duplication or duplicated side effects.

## Observed limitations

- retry ownership is often unclear across SDK, orchestrator, tool adapter, model loop, and workflow layers;
- identical failures may be retried at several layers, multiplying attempts;
- stateful/non-idempotent operations may be repeated after ambiguous timeouts;
- watchdogs may mistake long but progressing work for a stall;
- simple attempt caps do not use progress signals;
- retry loops often lack cumulative token/time/tool-call budgets;
- failures may be logged as individual events without an aggregate storm detector;
- restart-from-zero discards completed setup and context.

## Root-cause hypotheses

1. **No single retry owner.** Multiple layers independently retry the same logical operation.
2. **No semantic fingerprint.** The runtime cannot recognize equivalent calls with equivalent outputs.
3. **No progress contract.** A retry is allowed without proving that new information or state may be obtained.
4. **No idempotency boundary.** Ambiguous failures make re-execution unsafe.
5. **No circuit state.** Repeated failures never transition the operation into OPEN/blocked state.
6. **No cumulative budget.** Each layer sees only its local attempt count.
7. **Watchdogs use time-only heuristics.** Active progress is not considered.

## Improvement target

Implement a host-side retry supervisor with:

- canonical operation fingerprints;
- retryability classification;
- one declared retry owner per operation;
- per-operation and per-run retry budgets;
- cumulative elapsed-time and estimated-token budgets;
- exponential backoff with full jitter for transient failures;
- progress-aware duplicate detection;
- circuit breaker states CLOSED / OPEN / HALF_OPEN;
- idempotency-key requirement for repeatable side-effecting operations;
- checkpoint reuse instead of restart-from-zero where supported;
- deterministic reason codes and structured trace output.

## Success metrics

- repeated identical no-progress attempts intercepted before configured threshold;
- maximum retry count and retry elapsed time never exceed policy;
- zero automatic re-execution of non-idempotent operations without stable idempotency key or explicit approval;
- retry amplification factor reduced (total physical attempts / logical operations);
- fewer tool/model calls per failed operation;
- lower wasted tokens and wall-clock time per failed run;
- no regression in recovery rate for genuinely transient failures;
- every circuit-open event has a deterministic reason and trace evidence.

## Observed evidence, interpretation, proposal

### Observed evidence

Multiple 2026 issues report repeated identical calls, retry storms, restart loops, and large token/time waste. Established distributed-systems guidance recommends bounded retries, jitter, idempotency, fail-fast behavior, and avoiding retries at multiple layers.

### Interpretation

Agent runtimes need retry control above conventional HTTP clients because a semantically identical action can be regenerated as a brand-new tool invocation, bypassing lower-layer attempt limits.

### Proposed engineering solution

This package provides deterministic retry accounting and circuit breaking around logical agent operations. It does not attempt to infer hidden chain-of-thought. It uses observable fields only: operation identity, arguments, result/error class, timestamps, progress markers, attempt counts, token estimates, idempotency keys, and checkpoints.