# CAN and Fieldbus Integration

## Purpose
Engineer robust CAN/CAN-FD and comparable fieldbus communication with correct identifiers, timing, state handling, fault recovery, and application semantics.

## When to use
Use for automotive, industrial, robotics, distributed controllers, bus-off incidents, message loss, or protocol integration.

## Inputs
Network specification, bitrate/timing, transceiver design, message database/contracts, controller documentation, captures, and error counters.

## Context to inspect
Inspect termination, identifiers, filters, arbitration load, payload encoding, endianness, counters, timeouts, error states, and bus-off recovery.

## Core knowledge
CAN reliability depends on physical layer quality, bit timing, arbitration, load, controller error confinement, and application freshness semantics. Successful transmission does not prove the consumer interpreted the payload correctly.

## Procedure
1. Confirm physical topology and termination.
2. Validate nominal/data bit timing and sample points.
3. Define identifier ownership and message contracts.
4. Specify freshness, timeout, counter, and invalid-value behavior.
5. Configure acceptance filters deliberately.
6. Monitor error counters and bus states.
7. Define bounded bus-off recovery policy.
8. Analyze bus utilization at peak traffic.
9. Capture and decode representative and fault traffic.

## Decision points
Use periodic frames for predictable state dissemination; event-driven frames for sparse events with appropriate rate limits. Recovery policy should follow system safety requirements rather than automatically reconnecting forever.

## Common failure patterns
Duplicate IDs, wrong endianness/scaling, ignoring stale data, excessive bus load, silent bus-off loops, poor termination, and testing only with a single node.

## Verification
Validate decoded captures, peak utilization, error handling, node restart behavior, stale-message detection, and bus-off recovery.

## Expected output
A documented fieldbus integration with message semantics, timing, load analysis, diagnostics, and recovery behavior.

## Stop conditions
Stop when network ownership, physical topology, safety recovery requirements, or authoritative message definitions are unavailable.