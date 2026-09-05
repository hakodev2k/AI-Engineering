# Distributed Training Rules

## Purpose
Preserve correctness and recoverability when training spans multiple accelerators, hosts, or parallelism strategies.

## Scope
Data, tensor, pipeline, sequence, expert, and optimizer-state parallelism plus collective communication.

## MUST
- Distributed topology and sharding strategy MUST be explicit and compatible with model, optimizer, checkpoint, and restart logic.
- Collective failures, rank divergence, and stalled workers MUST be detectable through bounded timeouts and telemetry.
- Gradient synchronization semantics MUST be validated when accumulation, clipping, mixed precision, or conditional computation is used.
- Scale-up changes MUST be checked for effective batch size, learning-rate, numerical, and convergence consequences.
- Restart tests MUST demonstrate that distributed state can resume without silent parameter or optimizer corruption.

## MUST NOT
- MUST NOT treat a run as healthy solely because all workers remain alive.
- MUST NOT ignore repeated stragglers or communication retries that materially distort utilization or step timing.
- MUST NOT change parallelism strategy in a controlled comparison without documenting the resulting numerical differences.

## SHOULD
- New topologies SHOULD be validated at smaller scale before consuming a full cluster.
- Communication/computation overlap SHOULD be measured rather than assumed beneficial.

## Exceptions
Temporary diagnostic bypasses require isolation from release evidence and documented risk.

## Verification
Inspect topology manifests, collective telemetry, per-rank loss/gradient checks, effective batch calculations, restart tests, and scaling-efficiency measurements.