# Batching and Scheduling Rules

## Purpose
Ensure request batching and scheduling improve throughput without violating latency, fairness, cancellation, or resource-safety requirements.

## Scope
Applies to static batching, continuous batching, prefill/decode scheduling, queue policies, priorities, admission control, and request cancellation.

## MUST
- Batching policy MUST define maximum queue delay, batch size or token budget, and behavior under overload.
- Scheduling MUST preserve documented priority and fairness guarantees across tenants or request classes.
- Cancelled or expired requests MUST stop consuming scarce inference resources as soon as safely practical.
- Prefill and decode scheduling changes MUST be benchmarked with representative prompt and generation-length distributions.
- Queueing metrics MUST expose wait time separately from model execution time.
- Scheduler configuration MUST have bounded values that prevent unbounded memory or latency growth.

## MUST NOT
- MUST NOT maximize batch size at the expense of an agreed latency SLO without explicit approval.
- MUST NOT allow low-priority traffic to starve critical traffic or vice versa without a documented policy.
- MUST NOT hide queueing delay inside aggregate inference latency when diagnosing performance.
- MUST NOT enable an experimental scheduler globally without staged validation.

## SHOULD
- Token-aware batching SHOULD be preferred over request-count batching when sequence lengths vary materially.
- Scheduling SHOULD minimize head-of-line blocking and pathological long-request interference.
- Priority mechanisms SHOULD be simple enough to explain and observe during incidents.

## Exceptions
Exceptions require measured evidence, affected traffic classes, risk, duration, rollback steps, and approval when customer-facing SLOs change.

## Verification
Inspect scheduler configuration, queue metrics, load-test traces, cancellation tests, fairness analysis, and latency distributions. Validate overload behavior under realistic mixed-length traffic.