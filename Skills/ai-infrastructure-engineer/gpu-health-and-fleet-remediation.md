# GPU Health and Fleet Remediation

## Purpose
Detect, quarantine, diagnose, and safely return unhealthy accelerator nodes to service while minimizing repeated job failures and hidden capacity loss.

## When to use
Use for ECC/Xid errors, unexplained GPU resets, repeated node failures, thermal issues, degraded links, or fleet health automation.

## Inputs
Device health events, node metrics, job-failure history, firmware/driver versions, diagnostic results, hardware inventory.

## Context to inspect
Error frequency, affected GPU/node/rack, temperature and power, PCIe/NVLink health, recent upgrades, workload correlation, provider/RMA history, and scheduler state.

## Core knowledge
Not every device error requires hardware replacement, but repeated or uncorrectable errors should not be allowed to poison production workloads. Remediation must distinguish transient software faults, node-level faults, and physical accelerator failures.

## Procedure
1. Correlate job failures with device and node health events.
2. Drain or quarantine suspect nodes before repeated retries consume workloads.
3. Preserve diagnostics and error history.
4. Run vendor and platform health checks.
5. Validate driver, firmware, power, thermal, PCIe, and interconnect state.
6. Reboot or reset only when the failure mode supports it.
7. Run burn-in and representative GPU tests before re-admission.
8. Escalate recurring physical faults to replacement/RMA.
9. Track quarantined capacity and mean time to remediation.
10. Automate known-safe detection and quarantine patterns.

## Decision points
Return a node only after clean diagnostics and burn-in. Replace hardware when failures recur after known-good software and environmental checks.

## Common failure patterns
Automatically rescheduling onto the same bad node, clearing errors by reboot without evidence, returning nodes after a single trivial test, and failing to track quarantined fleet capacity.

## Verification
Confirm sustained clean health telemetry, successful representative workloads, and no recurrence during the observation window.

## Expected output
A documented remediation record and a healthy node either restored to service or removed for repair.

## Stop conditions
Stop when physical intervention, provider replacement, safety review, or privileged hardware actions exceed available authority.