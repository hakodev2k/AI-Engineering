# Reliability and Fault Handling Rules

## Purpose
Make accelerator failures detectable, contained, recoverable, and operationally actionable.

## Scope
Device faults, resets, ECC events, hangs, runtime fatal errors, and degraded hardware.

## MUST
- Fatal and recoverable GPU error classes MUST have defined handling behavior.
- Suspected hardware faults MUST preserve diagnostic evidence before destructive recovery when feasible.
- Repeated device faults MUST trigger quarantine or equivalent protection rather than endless retry.
- Services MUST distinguish workload errors from device/platform health failures.
- Recovery procedures MUST protect state consistency and avoid duplicate side effects.

## MUST NOT
- MUST NOT retry indefinitely after device-lost or persistent hardware errors.
- MUST NOT return a device to production solely because a process restart succeeded.
- MUST NOT suppress ECC or health telemetry.

## SHOULD
- Use bounded retry only for explicitly transient error classes.
- Exercise fault paths before production incidents occur.

## Exceptions
Emergency reuse of degraded capacity requires risk acceptance, monitoring, time bound, and human approval.

## Verification
Run fault injection, inspect health telemetry and retry policies, review quarantine logic, and test recovery state consistency.