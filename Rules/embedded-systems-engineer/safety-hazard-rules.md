# Safety and Hazard Rules

## Purpose
Prevent firmware behavior from creating unacceptable physical or operational hazards.

## Scope
Actuators, thermal/energy controls, motion, interlocks, hazardous states, and safety-related functions.

## MUST
- Identify firmware-relevant hazards and map mitigations to verifiable requirements.
- Default outputs to a defined safe state on startup, detected corruption, or loss of control where applicable.
- Preserve independent safety mechanisms required by the system design.

## MUST NOT
- Bypass an interlock, limit, or safety control without explicit authorized approval.
- Treat software assertions alone as sufficient mitigation for physical hazards.

## SHOULD
- Prefer fail-safe designs and independent protection layers for high-consequence failures.

## Exceptions
Safety deviations require formal hazard review and designated human approval.

## Verification
Trace hazards to controls and tests; perform fault injection, boundary testing, and safety review on representative hardware.