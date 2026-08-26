# ML Resource Abuse and Denial-of-Service Defense

## Purpose
Prevent attackers or faulty clients from exhausting expensive ML compute, memory, queue capacity, or downstream dependencies.

## When to use
Use for public inference, multimodal endpoints, batch scoring, GPU services, or systems with variable-cost requests.

## Inputs
Request schema, model resource profile, traffic baselines, quotas, scheduler/batcher behavior, SLOs, and scaling limits.

## Preconditions
Measure representative cost by input dimensions and model options.

## Context to inspect
Inspect gateways, queues, token/image/audio limits, dynamic batching, GPU memory, autoscaling, retries, streaming, cancellation, and downstream tools/services.

## Core knowledge
ML workloads can have highly nonlinear cost. Autoscaling alone can convert denial of service into cost exhaustion. Defense requires admission control, bounded work, fair scheduling, cancellation, and capacity-aware degradation.

## Procedure
1. Identify request fields that drive compute or memory cost.
2. Establish per-model cost envelopes and safe concurrency.
3. Enforce input, output, batch, and duration limits before expensive processing.
4. Apply authenticated quotas and rate limits.
5. Use queue bounds and backpressure.
6. Implement cancellation for disconnected/timed-out requests.
7. Prevent unbounded retries across gateways and workers.
8. Partition capacity or apply fair scheduling for critical tenants.
9. Define overload behavior: reject, degrade, queue, or route to cheaper capacity.
10. Alert on abnormal cost per identity and request class.
11. Load-test adversarial worst-case inputs and recovery.
12. Cap autoscaling/cost where business policy requires.

## Decision points
Queue only when clients tolerate delay and queue growth is bounded. Reject early when work cannot meet SLO. Use cheaper fallback models only when semantic/product requirements allow it.

## Common failure patterns
Unlimited context/batch size; retries multiplying expensive inference; autoscaling with no spend ceiling; unauthenticated free endpoints; disconnected clients consuming GPU work; one tenant monopolizing dynamic batches.

## Verification
Stress worst-case legal requests, confirm limits trigger before resource collapse, verify fairness and cancellation, measure recovery time, and ensure alerts identify abusive principals.

## Expected output
A resource-abuse control plan with enforceable limits, overload policy, tests, telemetry, and capacity assumptions.

## Stop conditions
Stop when safe model limits are unknown, stress testing could affect production, or overload policy requires business decisions not yet approved.