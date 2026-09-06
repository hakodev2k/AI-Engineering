# Workload Profiling Rules

## Purpose
Require evidence-first diagnosis before GPU optimization work.

## Scope
Training, inference, preprocessing, kernels, communication, and end-to-end GPU workloads.

## MUST
- Performance work MUST begin with a representative baseline using production-relevant shapes, batch sizes, concurrency, and hardware.
- Profiles MUST identify time distribution across host, device, kernels, memory transfer, synchronization, and communication where applicable.
- Bottleneck claims MUST be supported by profiler traces, counters, timings, or equivalent runtime evidence.
- Profiles MUST record software versions, accelerator model, driver/runtime versions, precision mode, and relevant configuration.
- Repeated measurements MUST report variance when results are unstable.

## MUST NOT
- MUST NOT optimize based only on code inspection or intuition when profiling is feasible.
- MUST NOT compare runs with materially different workloads or environments as if they were equivalent.
- MUST NOT hide synchronization or warm-up effects from reported measurements.

## SHOULD
- SHOULD separate cold-start, steady-state, and saturated-load behavior.
- SHOULD retain representative traces for future regression analysis.

## Exceptions
Exceptions require a documented reason profiling cannot be performed, alternative evidence, risk, and reviewer approval.

## Verification
Review profiler artifacts, benchmark metadata, raw timings, environment capture, and analysis notes.