# Power Management Rules

## Purpose
Ensure power transitions preserve correctness, device state, wake behavior, and energy goals.

## Scope
Suspend, resume, idle, runtime power management, clocks, regulators, wake sources, and thermal interactions.

## MUST
- Power transitions MUST define ordering dependencies among devices and subsystems.
- Suspend paths MUST quiesce operations that cannot safely continue in the target state.
- Resume paths MUST restore or revalidate state before making resources available.
- Wake sources MUST be explicitly managed and released.
- Power optimizations MUST be measured for both energy benefit and latency/reliability impact.

## MUST NOT
- MUST NOT power down resources while dependent users can still access them.
- MUST NOT assume hardware state survives a power transition unless guaranteed.
- MUST NOT introduce indefinite waits for device power-state changes.
- MUST NOT sacrifice data integrity for lower power consumption without explicit approved semantics.

## SHOULD
- Runtime power management SHOULD fail conservatively when state is uncertain.
- Transition paths SHOULD be idempotent or safely reject invalid repetition.
- Power policy SHOULD remain separate from low-level mechanism where practical.

## Exceptions
Exceptions require platform evidence, measured benefit, failure analysis, and maintainer approval.

## Verification
Run repeated suspend/resume cycles, runtime-idle stress, concurrent I/O during transitions, wake-source tests, fault injection, and energy/latency measurements.