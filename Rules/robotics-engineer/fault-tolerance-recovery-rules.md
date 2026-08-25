# Fault Tolerance and Recovery Rules
## Purpose
Ensure faults produce bounded degradation rather than cascading or surprising behavior.
## Scope
Subsystem faults, watchdogs, redundancy, retries, restart, degraded modes, and recovery.
## MUST
- Classify credible faults by detectability, consequence, containment, and recovery strategy.
- Define safe or degraded behavior for loss of critical compute, sensing, actuation, communication, and power.
- Bound retries and automatic restart loops.
- Ensure watchdog actions cannot create a more hazardous state than the fault they address.
## MUST NOT
- Clear consequential faults without preserving evidence and confirming recovery conditions.
- Resume autonomous motion automatically after faults requiring operator inspection or environmental confirmation.
## SHOULD
- Test combinations of faults where common-cause failure is plausible.
## Exceptions
Automatic recovery from high-consequence faults requires demonstrated safety and explicit design approval.
## Verification
Use fault injection, watchdog tests, power/network interruption, degraded-mode tests, recovery logs, and FMEA review.