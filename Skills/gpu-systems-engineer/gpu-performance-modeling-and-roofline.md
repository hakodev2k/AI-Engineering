# GPU Performance Modeling and Roofline

## Purpose
Use simple quantitative models to predict attainable GPU performance, identify limiting resources, and prioritize optimization work.

## When to use
Use before major kernel redesigns, for hardware selection, scaling analysis, or when profiler symptoms need a quantitative bound.

## Inputs
Operation counts, bytes moved, shapes, measured bandwidth/compute, hardware specifications, kernel and end-to-end timings.

## Preconditions
Define the operation boundary consistently and measure realistic rather than marketing peak characteristics where possible.

## Context to inspect
Inspect arithmetic intensity, cache/reuse assumptions, precision, instruction mix, memory hierarchy, launch overhead, synchronization, and communication.

## Core knowledge
Roofline relates arithmetic intensity to compute and bandwidth ceilings. Real ceilings can be below theoretical peaks because of instruction mix, occupancy, latency, access inefficiency, and synchronization. Models are useful when their assumptions are explicit and checked.

## Procedure
1. Define the exact kernel/workload boundary.
2. Count or estimate useful operations.
3. Estimate bytes transferred at relevant memory levels.
4. Compute arithmetic intensity.
5. Establish realistic compute and bandwidth ceilings for the target GPU.
6. Place measured performance against those ceilings.
7. Identify the dominant gap: traffic, compute efficiency, latency, launch, or synchronization.
8. Predict the maximum value of candidate optimizations.
9. Prioritize changes with meaningful theoretical headroom.
10. Measure and update the model after changes.

## Decision points
Optimize data movement when near a bandwidth roof; optimize instruction throughput when compute-bound. Do not chase kernel-level ceilings when host, launch, or communication dominates end-to-end time.

## Common failure patterns
Using theoretical peak bandwidth as achieved bandwidth, undercounting intermediate traffic, ignoring cache effects, counting useless operations as progress, assuming all FLOPs have equal throughput, and applying roofline to launch-bound microkernels without overhead terms.

## Verification
Compare model predictions with profiler counters and measured improvements; explain material discrepancies rather than tuning the model to fit blindly.

## Expected output
A quantitative bottleneck model, attainable-performance estimate, and prioritized optimization hypotheses.

## Stop conditions
Stop when operation/traffic estimates are too uncertain to guide decisions, measurements contradict core assumptions, or the true bottleneck lies outside the modeled boundary.