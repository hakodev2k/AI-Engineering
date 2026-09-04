# GPU Reliability and Health Rules

## Purpose
Detect accelerator degradation early and keep unhealthy hardware from causing repeated workload failures or silent performance loss.

## Scope
Applies to GPU device health, ECC behavior, resets, thermal faults, link errors, host health, quarantine, and return-to-service decisions.

## MUST
- Device and host health MUST be evaluated using hardware telemetry, runtime errors, workload symptoms, and diagnostic evidence.
- Repeated or severe accelerator faults MUST trigger quarantine according to defined thresholds.
- Returning a quarantined node to service MUST require successful diagnostics and evidence that the suspected fault is resolved or acceptably bounded.
- Health policy MUST distinguish transient workload errors from infrastructure faults where evidence allows.
- Hardware replacements and repairs MUST preserve inventory traceability.

## MUST NOT
- Repeated GPU resets MUST NOT be treated as a permanent remediation without root-cause investigation.
- Unhealthy nodes MUST NOT remain schedulable solely to preserve nominal capacity.
- Error counters MUST NOT be cleared to hide unresolved degradation.

## SHOULD
- Fleet health SHOULD be compared across hardware generation, firmware, driver, rack, and age to identify systemic patterns.
- Predictive maintenance SHOULD be used only when supported by validated evidence.

## Exceptions
Exceptions require explicit service risk, monitoring, bounded duration, and technical-owner approval.

## Verification
Inspect device telemetry, diagnostics, quarantine events, repair records, scheduler state, failure rates, and post-repair burn-in results.