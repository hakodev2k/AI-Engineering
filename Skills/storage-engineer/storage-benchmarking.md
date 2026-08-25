# Storage Benchmarking

## Purpose
Produce reproducible storage benchmarks that represent real workload semantics and avoid misleading cache, queue, or dataset effects.

## When to use
Use for technology evaluation, acceptance testing, tuning, migration validation, or capacity modeling.

## Inputs
Workload profile, candidate systems, SLOs, dataset size, concurrency, request mix, durability semantics, and test environment.

## Preconditions
Protect production data; isolate destructive tests and record all relevant configuration.

## Context to inspect
Host CPU/memory, filesystem, mount options, cache, queue settings, network, storage tier, replication, compression, encryption, and background tasks.

## Core knowledge
Benchmark results are meaningful only for stated conditions. Warm/cold cache, sync/async writes, compressibility, queue depth, dataset size, and test duration can radically change results.

## Procedure
1. Translate workload characterization into test profiles.
2. Define success metrics and run duration.
3. Create a dataset larger than unintended caches where appropriate.
4. Control warm-up and cache state.
5. Record software/hardware configuration.
6. Run multiple repetitions.
7. Capture latency distributions, IOPS, throughput, CPU, network, and queueing.
8. Test steady state and relevant degraded states.
9. Analyze variance and confidence.
10. Preserve scripts and raw results.

## Decision points
Use synthetic tools for controlled component limits and application-level benchmarks for end-to-end validity. Never substitute peak synthetic numbers for production expectations.

## Common failure patterns
Tiny datasets, short tests, compressible zero data, buffered writes presented as durable, one-run conclusions, and comparing systems with unequal protection settings.

## Verification
Re-run from documented instructions and obtain materially consistent results; confirm benchmark IO semantics match the target workload.

## Expected output
A reproducible benchmark package with methodology, configuration, raw evidence, distributions, interpretation, and limitations.

## Stop conditions
Stop if tests can overwrite real data, configurations are not comparable, or durability semantics cannot be verified.
