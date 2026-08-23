# Network Fault Rules
## Purpose
Validate resilience to realistic network degradation.
## Scope
Latency, packet loss, partitions, DNS, connection resets, and bandwidth constraints.
## MUST
- Specify direction, targets, intensity, duration, and expected recovery.
- Protect management and abort channels from accidental isolation where practical.
## MUST NOT
- Apply broad network faults without understanding routing and shared infrastructure.
- Treat latency injection as equivalent to a full partition.
## SHOULD
- Test asymmetric and intermittent failures when architecture is sensitive to them.
## Exceptions
Full-zone exercises require coordinated approval and independent control paths.
## Verification
Inspect fault configuration, network telemetry, service behavior, and cleanup.