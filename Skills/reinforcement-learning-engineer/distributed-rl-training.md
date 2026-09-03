# Distributed RL Training

## Purpose
Scale RL training across actors, learners, simulators, and accelerators while preserving policy/data consistency, reproducibility, and meaningful throughput gains.

## When to use
Use when single-process training cannot meet interaction, simulation, or optimization throughput requirements.

## Inputs
- Environment step cost
- Learner compute profile
- Actor/learner topology
- Network and storage constraints
- Training throughput targets

## Preconditions
A correct single-node baseline and stable evaluation protocol must exist before scaling.

## Context to inspect
Inspect actor lag, replay freshness, learner utilization, environment throughput, queue depth, checkpoint consistency, network overhead, and straggler behavior.

## Core knowledge
Distributed RL introduces policy staleness and non-IID data flow in addition to normal distributed-systems problems. More actors can reduce learner data freshness or overwhelm replay. Throughput is useful only if sample efficiency and policy quality remain acceptable.

## Procedure
1. Profile the single-node pipeline by environment, inference, transfer, and learning time.
2. Identify the actual bottleneck before adding workers.
3. Choose synchronous or asynchronous collection based on staleness tolerance.
4. Define policy-version metadata for every trajectory.
5. Bound actor-policy lag and replay age.
6. Scale actors gradually while tracking learner utilization and policy quality.
7. Add backpressure rather than allowing unbounded queues.
8. Test worker loss and recovery.
9. Make checkpoints include optimizer, replay/state metadata, and policy version as required.
10. Compare wall-clock improvement and sample efficiency against the single-node baseline.

## Decision points
Prefer synchronous collection when stale policies materially harm learning. Prefer asynchronous collection when environment latency dominates and correction mechanisms are valid. Do not distribute a pipeline whose bottleneck is algorithmic inefficiency.

## Common failure patterns
- Actor count grows while useful sample freshness falls.
- Throughput improves but final return regresses.
- Checkpoints cannot reproduce learner state.
- Worker retries duplicate trajectories silently.

## Verification
Verify fault recovery, policy-version tracking, bounded queue/staleness metrics, reproducible checkpoint restore, and better wall-clock performance without unacceptable sample-efficiency loss.

## Expected output
A distributed training topology with measured scaling efficiency, staleness controls, recovery behavior, and reproducibility evidence.

## Stop conditions
Stop when scaling no longer improves time-to-quality, data staleness invalidates learning, or checkpoint/recovery correctness cannot be demonstrated.