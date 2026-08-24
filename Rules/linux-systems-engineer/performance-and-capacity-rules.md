# Performance and Capacity Rules

## Purpose
Make host performance decisions from measured bottlenecks and preserve capacity headroom.

## Scope
Applies to CPU, memory, NUMA, storage I/O, network, process limits, kernel pressure, and capacity planning.

## MUST
- Performance investigations MUST begin with a defined symptom, timeframe, workload, and measurable success criterion.
- Bottleneck claims MUST be supported by runtime evidence such as saturation, latency, queueing, pressure, profiling, or workload metrics.
- Tuning changes MUST record baseline measurements and compare post-change results under comparable conditions.
- Capacity plans MUST include growth, failure redundancy, maintenance, and burst headroom.
- Memory pressure analysis MUST distinguish cache use, working set, reclaim, swapping, OOM behavior, and cgroup limits where relevant.

## MUST NOT
- Performance improvement MUST NOT be claimed from configuration intuition alone.
- Cache dropping, forced compaction, or similarly disruptive tuning MUST NOT be used routinely to manufacture temporary headroom.
- Host-level averages MUST NOT conceal per-core, per-device, NUMA, or cgroup saturation when those dimensions matter.

## SHOULD
- Change one material variable at a time during controlled tuning.
- Prefer removing the actual bottleneck over raising limits indefinitely.
- Trend leading capacity indicators.

## Exceptions
Incident mitigation may prioritize restoration over controlled experimentation, but measurements and temporary changes MUST be captured for follow-up.

## Verification
Compare before/after metrics, pressure and queue indicators, benchmark or production workload behavior, resource limits, and capacity forecasts. Require reproducible evidence for material tuning recommendations.