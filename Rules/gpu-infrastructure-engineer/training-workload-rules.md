# GPU Training Workload Rules

## Purpose
Ensure shared infrastructure supports distributed training safely, efficiently, and recoverably at production scale.

## Scope
Applies to long-running training jobs, distributed workers, checkpoints, collectives, retries, preemption, and resource placement.

## MUST
- Long-running training jobs MUST define checkpoint and recovery behavior appropriate to expected interruption cost.
- Distributed training MUST validate worker count, topology, communication backend, and synchronization assumptions on the target platform.
- Infrastructure-induced training failures MUST be distinguishable from model, data, or application failures using evidence.
- Retry policy MUST account for checkpoint state and MUST avoid repeatedly restarting deterministic failures.
- Training jobs using scarce capacity MUST expose progress and utilization sufficient to identify stalled or wasteful execution.

## MUST NOT
- Preemptible capacity MUST NOT be used for nonrecoverable critical training without explicit loss acceptance.
- A worker failure MUST NOT automatically justify restarting an entire expensive job when safe partial recovery is supported and validated.
- Training success MUST NOT be inferred only from process survival when progress has stalled.

## SHOULD
- Large jobs SHOULD validate scale efficiency before consuming substantially more GPUs.
- Checkpoint frequency SHOULD balance recovery loss, storage load, and runtime overhead using measurements.

## Exceptions
Exceptions require documented interruption risk, recovery strategy, evidence, and owner approval.

## Verification
Review checkpoint tests, distributed-job traces, scale-efficiency benchmarks, retry events, progress telemetry, and failure-injection results.