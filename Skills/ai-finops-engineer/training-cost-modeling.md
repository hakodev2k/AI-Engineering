# Training Cost Modeling

## Purpose
Estimate, forecast, and validate the end-to-end cost of model training and fine-tuning before large commitments are made.

## When to use
Use when planning pretraining, fine-tuning, RL, distillation, hyperparameter searches, or repeated retraining. Do not rely on accelerator-hours alone when storage, checkpointing, data preparation, networking, and failure risk are material.

## Inputs
- Model architecture and parameter count
- Dataset size and token/sample counts
- Planned sequence lengths, epochs, and batch sizes
- Hardware options and measured throughput
- Cloud/vendor pricing
- Checkpoint, storage, network, and orchestration costs
- Historical failure and restart rates

## Preconditions
At least one credible throughput benchmark or analogous historical workload should exist. Mark extrapolated assumptions explicitly.

## Context to inspect
Inspect parallelism strategy, precision, optimizer states, activation checkpointing, data pipeline, checkpoint cadence, distributed topology, spot/preemptible use, and expected experiment count.

## Core knowledge
Training cost is driven by useful training work, hardware throughput, utilization, failure overhead, and supporting services. FLOP-based estimates are useful for order-of-magnitude planning but must be calibrated with observed throughput and scaling efficiency.

## Procedure
1. Define the training objective and completion criterion.
2. Estimate total training work in tokens, samples, steps, or FLOPs.
3. Benchmark or obtain credible throughput for candidate hardware.
4. Model scaling efficiency across node counts.
5. Calculate base accelerator-hours and cost.
6. Add CPU, storage, checkpoint, data-transfer, scheduler, and observability costs.
7. Add expected restart, failed-run, and experimentation overhead.
8. Model low/base/high scenarios.
9. Compare hardware and purchasing options.
10. Establish budget checkpoints tied to training progress.
11. Reforecast using actual burn rate after the first stable training window.
12. Reconcile final actual cost against the model and update assumptions.

## Decision points
- Use on-demand capacity for uncertain workloads; commitments for predictable sustained demand.
- Use spot/preemptible capacity only when checkpoint/recovery economics are favorable.
- Increase cluster size only when time-to-result value exceeds reduced scaling efficiency.

## Common failure patterns
- Ignoring failed runs and hyperparameter exploration.
- Assuming linear multi-node scaling.
- Using vendor peak throughput instead of measured workload throughput.
- Omitting data engineering and checkpoint storage costs.
- Treating research uncertainty as a single deterministic estimate.

## Verification
Compare estimated and actual accelerator-hours, throughput, support-service cost, failure overhead, and final total. Explain variance beyond agreed tolerance.

## Expected output
A scenario-based training cost model, assumptions register, budget checkpoints, and variance report.

## Stop conditions
Stop when model configuration or dataset scope is too uncertain for a useful estimate, or when projected spend exceeds approved budget without authorization.