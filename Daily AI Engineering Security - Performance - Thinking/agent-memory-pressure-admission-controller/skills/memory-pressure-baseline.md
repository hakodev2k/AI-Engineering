# Skill: Memory Pressure Baseline and Admission Sizing

## Purpose
Establish a measurable memory baseline and derive a conservative worker-admission policy before optimizing concurrency.

## Trigger
New worker type, new agent runtime, host-size change, memory incident, or observed UI/host slowdown.

## Inputs
Host total/available memory; swap/pagefile state; representative worker RSS/working-set samples; active-worker count; platform pressure indicators; task throughput.

## Preconditions
Measurements come from the target class of host and representative workloads. Do not infer worker size from binary size alone.

## Required context
Parent/UI memory floor, typical and p95 worker footprint, expected concurrency, platform memory semantics, and whether swap/pagefile exists.

## Allowed tools
OS process/memory inspection, `/proc/meminfo`, `/proc/pressure/memory` on Linux, platform-native task/process monitors, existing benchmark harnesses, and `scripts/memory_admission_guard.py`.

## Constraints
MUST establish a baseline before increasing concurrency. MUST NOT intentionally exhaust production hosts. SHOULD use isolated test hosts for pressure tests. MUST preserve enough headroom for the parent runtime and OS.

## Procedure
1. Capture idle total/available memory and parent/UI working set.
2. Run one representative worker; record steady-state and peak memory.
3. Repeat at least three times and choose a conservative estimate at or above the observed p95/peak relevant to the workload.
4. Record swap/pagefile and platform pressure behavior.
5. Define minimum post-spawn free bytes and reserve fraction.
6. Evaluate representative safe and unsafe snapshots with the admission guard.
7. Run bounded concurrency tests and measure responsiveness, pressure, failures, and throughput.
8. Adjust only when before/after evidence shows fewer false blocks without increasing pressure incidents.

## Decision points
If the worker footprint is highly variable, use the larger risk-tier estimate or dynamic per-worker estimates. If available-memory signals are misleading on the platform, use platform-native measurements and pressure telemetry rather than lowering reserves blindly.

## Expected output
Baseline table, selected worker estimate, admission policy, benchmark evidence, and known platform caveats.

## Metrics
Peak worker bytes, available bytes before/after spawn, projected vs observed post-spawn headroom, memory pressure time, task throughput, false-block rate.

## Verification
Independent performance verifier checks raw measurements and confirms the policy blocks known unsafe snapshots while admitting representative safe ones.

## Failure handling
If measurements disagree materially, repeat up to two additional samples. If still unstable, choose the conservative bound and escalate tuning rather than weakening the gate.

## Stop conditions
A stable baseline exists and policy behavior is verified, or the host is classified too small for the workload and spawning remains blocked.
