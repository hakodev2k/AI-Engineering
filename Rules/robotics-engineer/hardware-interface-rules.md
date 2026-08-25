# Hardware Interface Rules
## Purpose
Make hardware/software boundaries explicit, diagnosable, and failure-aware.
## Scope
Motor drives, sensors, GPIO, fieldbuses, serial links, device drivers, and firmware interfaces.
## MUST
- Specify electrical/logical interface contracts, units, ranges, timing, startup state, and fault semantics.
- Validate device identity and compatible firmware/configuration before enabling consequential commands.
- Handle disconnects, corrupted data, bus errors, resets, and partial initialization deterministically.
- Put outputs into defined safe states on communication loss where required.
## MUST NOT
- Assume zero-valued data means a healthy device unless the protocol guarantees it.
- Enable actuators before required initialization and safety checks complete.
## SHOULD
- Expose device health counters and diagnostic state.
## Exceptions
Unsupported hardware combinations require controlled experimental authorization and bounded operation.
## Verification
Inspect interface specifications, protocol tests, fault injection, power-cycle tests, bus traces, and device-health telemetry.