# Resource Exhaustion and Cost Abuse Testing

## Purpose
Assess whether adversarial use can cause excessive token, compute, tool, storage, queue, or third-party costs and degrade availability.

## When to use
Use for public AI endpoints, agents with loops/tools, expensive multimodal processing, or systems with user-controlled context and retrieval.

## Inputs
Rate limits, quotas, pricing, token/context limits, timeout/retry policies, queue architecture, tool costs, and test budgets.

## Context to inspect
Identify multiplicative paths: recursive agents, fan-out retrieval, retries, large uploads, streaming, tool loops, and asynchronous jobs.

## Core knowledge
AI workloads have variable and attacker-influenced cost. Availability protection requires admission control, bounded work, cancellation, quotas, backpressure, and cost-aware observability.

## Procedure
1. Build a cost model for request stages.
2. Identify attacker-controlled amplification factors.
3. Establish normal workload baselines.
4. Test maximum-size valid inputs within an isolated budget.
5. Test repeated tool calls, loops, retries, and fan-out.
6. Test concurrency and queue saturation safely.
7. Verify cancellation and timeout propagation.
8. Test per-user/tenant quotas and global circuit breakers.
9. Measure recovery after pressure is removed.
10. Recommend bounded-work controls.

## Decision points
Reject or truncate work early when marginal value is low; queue expensive work when synchronous guarantees are unnecessary. Apply both principal-level and system-level limits.

## Common failure patterns
Token limits without tool limits; retries multiplying load; no cancellation downstream; unlimited file processing; quotas based only on request count.

## Verification
Show that worst-case authorized inputs remain within defined resource budgets and abusive patterns are throttled without collapsing service for unrelated principals.

## Expected output
An amplification map, measured limits, failure modes, and prioritized availability controls.

## Stop conditions
Stop before shared infrastructure saturation or budget breach; do not perform uncontrolled denial-of-service testing.