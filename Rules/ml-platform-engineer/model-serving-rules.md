# Model Serving

## Purpose
Provide predictable, compatible, and recoverable production inference.

## Scope
Online inference services, runtimes, routing, batching, autoscaling, and model loading.

## MUST
- Serving interfaces MUST define request/response contracts, resource limits, timeouts, and failure semantics.
- Deployments MUST validate model/runtime compatibility before receiving production traffic.
- Capacity policy MUST account for startup time, accelerator availability, and peak demand.
- Rollback to a known-good model/runtime combination MUST be tested.

## MUST NOT
- Unvalidated model artifacts MUST NOT receive production traffic.
- Unbounded queues or batches MUST NOT be used to mask insufficient capacity.

## SHOULD
- Traffic SHOULD be shifted progressively when blast radius warrants it.

## Exceptions
Direct cutover requires documented risk, evidence, rollback readiness, and approval.

## Verification
Use contract tests, load tests, cold-start measurements, canary metrics, capacity tests, and rollback exercises.