# Communication Protocol Integration

## Purpose
Integrate wired or wireless protocol stacks with robust framing, state and recovery behavior.

## When to use
Use for UART, SPI-hosted protocols, CAN, USB, Ethernet or higher-level device protocols.

## Inputs
Protocol specification, transport, throughput, latency, topology and interoperability requirements.

## Context to inspect
Framing, state machines, buffers, timeouts, versioning, flow control and error telemetry.

## Core knowledge
Protocol correctness depends on explicit framing, state transitions, timeout semantics and backpressure. Transport success does not imply application success.

## Procedure
1. Define peer and interoperability requirements.
2. Model framing and states.
3. Bound message and buffer sizes.
4. Define timeout, retry and duplicate handling.
5. Define flow control/backpressure.
6. Validate malformed and partial input handling.
7. Add protocol-level telemetry.
8. Test with real peers and adverse timing.

## Decision points
Use existing standards/libraries when interoperability dominates; custom protocols require strong justification and version strategy.

## Common failure patterns
Unbounded parsing, ambiguous framing, retry amplification, no versioning, blocking receive loops and conflating transport with business acknowledgement.

## Verification
Run interoperability, fuzz/negative parsing, throughput and recovery tests.

## Expected output
A bounded, version-aware protocol integration with observable failure behavior.

## Stop conditions
Escalate when protocol ownership or compatibility requirements are unresolved.