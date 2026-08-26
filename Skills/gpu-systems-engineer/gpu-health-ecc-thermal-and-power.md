# GPU Health, ECC, Thermal, and Power

## Purpose
Distinguish software performance defects from accelerator health, thermal, power, and reliability conditions and respond safely.

## When to use
Use for unexplained slowdowns, device resets, ECC events, throttling, thermal excursions, power capping, or intermittent node failures.

## Inputs
Health telemetry, error counters, temperatures, clocks, power draw/limits, system logs, workload history, hardware topology.

## Preconditions
Preserve evidence before resets when safe and follow infrastructure change-control procedures.

## Context to inspect
Inspect corrected/uncorrected memory errors, device error events, throttling reasons, clocks, temperatures, fan/cooling state, power limits, PCIe link state, node events, and workload correlation.

## Core knowledge
Dynamic clocks and throttling alter performance. Correctable errors can indicate degradation trends; uncorrectable errors can invalidate computation or require isolation. Resetting a device may destroy diagnostic evidence and active workload state.

## Procedure
1. Correlate symptom time with hardware telemetry and system logs.
2. Compare affected GPU against healthy peers under similar load.
3. Identify thermal, power, clock, link, or memory-error anomalies.
4. Determine whether errors are transient, persistent, or increasing.
5. Drain/isolate hardware when reliability policy requires it.
6. Reproduce with a known workload if safe.
7. Avoid firmware/clock/power changes without authorization.
8. Escalate hardware evidence to infrastructure/vendor support.
9. Validate replacement/recovery with burn-in and representative workloads.
10. Preserve incident history for trend analysis.

## Decision points
Treat uncorrectable errors and repeated resets as reliability incidents, not tuning opportunities. Adjust power caps only when capacity policy explicitly supports performance-per-watt optimization.

## Common failure patterns
Restarting before collecting evidence, blaming software for throttling, ignoring corrected-error trends, overclocking production hardware, comparing unlike workloads, and returning unstable devices to service prematurely.

## Verification
Verify clean health telemetry, stable clocks/temperature, error-free stress/representative runs, expected performance, and monitoring after return to service.

## Expected output
A hardware-versus-software classification, evidence bundle, mitigation, and validated recovery state.

## Stop conditions
Stop and escalate for uncorrectable errors, repeated device loss, unsafe temperatures, facility/cooling anomalies, or changes requiring hardware privileges beyond authorization.