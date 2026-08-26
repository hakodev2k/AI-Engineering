# Denial-of-Service and Resource Exhaustion

## Purpose
Assess whether adversarial AI inputs can cause disproportionate compute, memory, storage, queue, or downstream cost.

## Scope
Inference, context processing, retrieval, agents, tools, recursive workflows, queues, and external APIs.

## MUST
- Test amplification paths using bounded workloads and defined resource ceilings.
- Measure resource impact rather than inferring denial-of-service from input complexity alone.
- Verify timeouts, depth limits, quotas, cancellation, and backpressure on relevant paths.

## MUST NOT
- Stress production beyond approved thresholds.
- Create self-replicating or unbounded agent loops during testing.

## SHOULD
Test worst-case context, fan-out, retry storms, recursive planning, and expensive tool combinations in isolation.

## Exceptions
Load beyond normal test ceilings requires capacity-owner approval and an abort plan.

## Verification
Inspect CPU, memory, token, queue, latency, cost, timeout, cancellation, and downstream-call telemetry.