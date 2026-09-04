# GPU Power Thermal and Clock Behavior

## Purpose
Separate software inefficiency from GPU power, thermal, clock, and throttling effects so benchmark conclusions reflect actual execution behavior.

## When to use
Use when performance varies across repeated runs or hosts, sustained workloads slow over time, clocks differ unexpectedly, or power limits constrain achievable throughput.

## Inputs
- GPU telemetry for clocks, temperature, power, utilization, and throttling reasons
- Baseline benchmark
- Host cooling and power configuration
- GPU model and deployment limits

## Context to inspect
Inspect application clocks where supported, power caps, thermal headroom, persistence mode, boost behavior, idle-to-load transitions, MIG/virtualization constraints, and competing processes.

## Core knowledge
GPU frequency is dynamic. Thermal or power limits can change measured throughput independently of code. A fair comparison requires recording hardware state and distinguishing short boost-heavy tests from sustained production behavior.

## Procedure
1. Capture clocks, temperature, power, and throttling state alongside baseline metrics.
2. Warm the device to a representative operating state.
3. Run a sustained benchmark long enough to expose throttling.
4. Compare hosts or GPUs using normalized software and power configurations.
5. Identify whether clock changes correlate with latency or throughput changes.
6. Check power-cap and cooling constraints before attributing variance to kernels.
7. Evaluate performance-per-watt when cost or thermal density matters.
8. Re-test software optimizations under the same power/thermal state.
9. Document environmental assumptions in benchmark results.

## Decision points
Use fixed/application clocks only when permitted and representative of deployment. Raise power caps only with infrastructure approval. Prefer efficiency improvements when extra power produces diminishing throughput returns.

## Common failure patterns
- Comparing cold and thermally saturated runs
- Ignoring different power caps across hosts
- Treating boost clock as guaranteed sustained frequency
- Benchmarking with competing GPU processes
- Calling a thermal issue a software regression

## Verification
Verify that performance comparisons use comparable device state and that observed improvements persist under sustained thermal equilibrium.

## Expected output
A hardware-state analysis with telemetry, correlation to performance, environmental controls, and any required infrastructure action.

## Stop conditions
Stop if changing clocks, power limits, or cooling requires unauthorized infrastructure changes, or if telemetry is insufficient to make a reliable attribution.