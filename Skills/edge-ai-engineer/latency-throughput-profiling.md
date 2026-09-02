# Latency and Throughput Profiling

## Purpose
Diagnose and optimize end-to-end edge inference latency, jitter, throughput, and queueing using evidence from real devices rather than isolated model timing.

## When to use
Use when latency SLOs are missed, frame rates collapse under load, p99 latency is unstable, or optimization priorities are unclear.

## Inputs
Target hardware, representative workload, profiler traces, timestamps, model/runtime configuration, preprocessing/postprocessing code, and latency/throughput targets.

## Preconditions
Use synchronized timestamps and a repeatable workload. Separate cold-start from steady-state measurements.

## Context to inspect
Sensor acquisition, decoding, preprocessing, model invocation, accelerator queues, postprocessing, IPC/networking, logging, output actuation, and backpressure.

## Core knowledge
End-to-end latency is not inference latency. Queueing, copies, synchronization, frequency scaling, thermal throttling, and contention often dominate tail behavior. Throughput and latency can conflict; batching increases efficiency but may violate real-time deadlines.

## Procedure
1. Define the exact start and end events for the latency SLO.
2. Instrument every major pipeline stage with monotonic timestamps.
3. Measure cold-start, warm steady-state, and sustained-load behavior.
4. Record percentiles, not only averages.
5. Identify queueing and synchronization gaps in traces.
6. Separate CPU, accelerator, memory-copy, and I/O contributions.
7. Test representative concurrency and background services.
8. Remove the largest verified bottleneck first.
9. Re-measure after each material change.
10. Test thermal steady state and low-power modes.
11. Add performance regression thresholds to CI/HIL where practical.

## Decision points
Batch only when deadline slack permits. Prefer pipelining when stages can overlap safely. Use asynchronous execution when it reduces idle time without creating unbounded queues or lifecycle complexity.

## Common failure patterns
Timing only the model call, using averages, benchmarking at full device clocks for seconds, unbounded frame queues, synchronous logging in hot paths, and optimizing tiny kernels before measuring queueing.

## Verification
Confirm latency percentiles, sustainable throughput, queue depth, dropped-work policy, and thermal steady-state results against requirements.

## Expected output
A stage-level performance profile, ranked bottlenecks, implemented optimizations, and verified latency/throughput evidence.

## Stop conditions
Stop when measurements are not reproducible, timestamps are incomparable, or hardware power/thermal state cannot be controlled or observed sufficiently.