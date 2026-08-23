# Connectivity Protocol Selection

## Purpose
Select connectivity and application protocols using measured operational constraints rather than popularity.

## When to use
Use for new device fleets, gateway design, protocol migration, or unreliable connectivity.

## Inputs
Range, bandwidth, latency, topology, power, payload size, security, regulatory and cost requirements.

## Context to inspect
Radio environment, network ownership, device density, roaming, backend support, and field conditions.

## Core knowledge
Wi-Fi, Ethernet, BLE, cellular, LPWAN, MQTT, CoAP, HTTP and vendor protocols optimize different constraints. Protocol choice affects battery life, reliability, observability, security, and operating cost.

## Procedure
1. Quantify traffic and latency requirements.
2. Model coverage and outage conditions.
3. Determine power and hardware limits.
4. Compare candidate transports and application protocols.
5. Define authentication, encryption, QoS, retry, and reconnect behavior.
6. Estimate fleet-scale bandwidth and cost.
7. Prototype under representative loss and interference.
8. Record the decision and fallback strategy.

## Decision points
Use persistent lightweight messaging when bidirectional low-overhead communication matters; request/response protocols may be simpler for infrequent interactions. Choose managed cellular/LPWAN when coverage value exceeds recurring cost.

## Common failure patterns
Lab-only testing, assuming permanent connectivity, unbounded retries, oversized payloads, and selecting QoS without understanding duplication semantics.

## Verification
Measure range, loss, reconnect time, throughput, power consumption, and backend behavior under degraded networks.

## Expected output
A justified protocol stack and operational configuration.

## Stop conditions
Stop when regulatory, carrier, spectrum, or deployment constraints require specialist approval.