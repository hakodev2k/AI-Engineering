# HPC Job Orchestration

## Purpose
Run large scientific workloads reliably on batch-scheduled clusters with efficient resource requests, restartability, dependency handling, and operational visibility.

## When to use
Use for multi-node simulations, parameter sweeps, long-running jobs, queued cluster workloads, or repeated failures caused by resource mismatch.

## Inputs
Executable, workload size, scheduler environment, node/GPU topology, memory/runtime estimates, checkpoint behavior, dependencies, and data locations.

## Context to inspect
Scheduler policies, queue limits, module/container environment, MPI launcher, filesystem behavior, job arrays, quotas, and prior job accounting.

## Core knowledge
HPC throughput depends on matching resource requests to real workload needs. Oversized jobs waste queue capacity; undersized jobs fail or thrash. Long jobs require checkpoint/restart, deterministic input capture, and clear failure classification.

## Procedure
1. Benchmark representative workload sizes.
2. Estimate CPU/GPU, memory, wall-time, and storage needs.
3. Choose node and process/thread topology.
4. Define reproducible environment setup.
5. Configure scheduler requests and affinity.
6. Add checkpoint/restart for long jobs.
7. Use job arrays or workflow dependencies for ensembles.
8. Capture logs, exit codes, resource accounting, and output metadata.
9. Classify failures as application, resource, scheduler, or infrastructure issues.
10. Tune requests from accounting evidence.

## Decision points
Use many smaller jobs when embarrassingly parallel work dominates; use tightly coupled multi-node runs only when communication requirements justify them. Prefer checkpointing over excessive wall-time requests.

## Common failure patterns
Requesting maximum resources by default, oversubscribing threads, writing heavily to shared filesystems, irreproducible module environments, and retrying deterministic failures without diagnosis.

## Verification
Confirm successful restart, compare scheduler accounting to requested resources, validate scaling, and reproduce outputs from recorded job inputs.

## Expected output
A robust batch workflow with justified resource requests, restart strategy, logs, and scaling evidence.

## Stop conditions
Stop when cluster policy, software environment, or required resource topology cannot be determined.