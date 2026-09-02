# Hardware-in-the-Loop Testing

## Purpose
Validate edge AI software on representative devices, sensors, accelerators, and timing conditions so failures hidden by desktop or simulation testing are detected before fleet rollout.

## When to use
Use before production releases, hardware revisions, runtime/driver upgrades, model changes, sensor changes, or when device-only regressions appear.

## Inputs
Target devices, representative sensors or recorded feeds, model/runtime artifacts, test cases, expected outputs, power/network controls, telemetry, and acceptance thresholds.

## Preconditions
Define supported hardware/firmware combinations and establish reproducible device provisioning.

## Context to inspect
Boot state, clocks, firmware, drivers, thermal state, sensor configuration, accelerator availability, storage, network, runtime versions, and previous test artifacts.

## Core knowledge
Desktop tests cannot reproduce accelerator compilers, memory limits, thermal behavior, driver differences, boot lifecycle, hardware clocks, or sensor timing. HIL tests should combine deterministic golden-vector checks with long-running system behavior and controlled fault injection.

## Procedure
1. Provision devices from a known baseline and record hardware/firmware identity.
2. Verify installed model/runtime artifact hashes and configuration.
3. Run deterministic golden input/output conformance tests.
4. Exercise real or faithfully replayed sensor pipelines.
5. Measure end-to-end latency, memory, temperature, and accelerator placement.
6. Test cold boot, warm restart, suspend/resume, and repeated model loading.
7. Inject network loss, sensor loss, low storage, corrupted artifacts, and process crashes where safe.
8. Run sustained soak workloads to expose leaks and throttling.
9. Repeat across supported hardware tiers and revisions.
10. Archive logs, metrics, device metadata, and failure reproduction steps.
11. Gate rollout on explicit pass/fail thresholds rather than manual impressions.

## Decision points
Use real sensors when physical timing/calibration is part of correctness; use recorded feeds for deterministic regression. Keep a small high-value HIL suite per commit and broader soak/fault suites for release candidates.

## Common failure patterns
Testing only one hardware revision, uncontrolled thermal state, stale firmware, no artifact identity, relying solely on simulation, and flaky tests caused by uncontrolled sensor/environment inputs.

## Verification
Re-run failing scenarios from clean device state, confirm deterministic pass criteria, and compare results across hardware cohorts before approval.

## Expected output
A repeatable HIL validation suite with device metadata, measurable gates, fault coverage, and archived evidence.

## Stop conditions
Stop when test hardware is not representative, provisioning cannot reproduce production state, or safety-sensitive fault injection lacks an approved test environment.