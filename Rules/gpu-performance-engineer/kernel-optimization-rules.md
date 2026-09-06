# Kernel Optimization Rules

## Purpose
Improve GPU kernel efficiency without sacrificing correctness, portability, or maintainability.

## Scope
Custom kernels, generated kernels, fused operators, launch configuration, instruction behavior, and kernel-level tuning.

## MUST
- Kernel changes MUST preserve numerical and functional correctness for supported inputs.
- Optimization MUST target a measured bottleneck such as launch overhead, instruction throughput, memory stalls, divergence, or occupancy pressure.
- Launch geometry and specialization assumptions MUST be validated against supported tensor shapes and hardware.
- Custom kernels MUST have correctness tests against a trusted reference implementation.
- Performance claims MUST include before/after measurements on representative hardware.

## MUST NOT
- MUST NOT introduce undefined synchronization, out-of-bounds access, data races, or architecture-specific assumptions without guards.
- MUST NOT fuse operations when fusion increases memory pressure or latency without net measured benefit.
- MUST NOT replace maintainable library kernels with custom kernels solely for theoretical gains.

## SHOULD
- SHOULD prefer vendor or compiler-generated kernels when they meet requirements.
- SHOULD document architecture-sensitive tuning parameters.

## Exceptions
Exceptions require measured evidence, portability impact, rollback plan, and reviewer approval.

## Verification
Run correctness tests, sanitizers where available, profiler analysis, architecture-specific benchmarks, and code review.