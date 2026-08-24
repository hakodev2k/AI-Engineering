# Network Resilience
## Purpose
Prevent unstable networks from cascading into edge service failure.
## Scope
WAN, LAN, cellular, satellite, mesh, and service-to-service communication.
## MUST
- Remote calls MUST have explicit timeouts.
- Retries MUST be bounded and safe for the operation semantics.
- Circuit breaking, load shedding, or equivalent protection MUST exist where dependency failure can cascade.
## MUST NOT
- MUST NOT retry indefinitely or at fixed high frequency.
- MUST NOT assume DNS, routing, bandwidth, or MTU characteristics remain constant.
## SHOULD
- Protocols SHOULD minimize unnecessary round trips on high-latency links.
## Exceptions
Deviation requires measured evidence and bounded failure impact.
## Verification
Use network emulation, timeout inspection, retry telemetry, dependency-failure tests, and packet/path diagnostics.