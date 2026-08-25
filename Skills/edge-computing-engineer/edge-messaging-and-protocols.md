# Edge Messaging and Protocols

## Purpose
Select and implement reliable messaging patterns and protocols across constrained, unreliable, and heterogeneous edge networks.

## When to use
Use when integrating devices, gateways, local services, brokers, or cloud ingestion endpoints.

## Inputs
- Payload sizes and rates
- Delivery requirements
- Network characteristics
- Device capabilities
- Security requirements

## Context to inspect
Inspect MQTT, AMQP, HTTP, WebSocket, CoAP, fieldbus, or proprietary protocol usage; broker topology; QoS; retained messages; and retry behavior.

## Core knowledge
Senior edge protocol design balances bandwidth, latency, durability, interoperability, session semantics, backpressure, and operational supportability.

## Procedure
1. Classify traffic as telemetry, command, event, bulk transfer, or request-response.
2. Define delivery and ordering needs per traffic class.
3. Measure link quality and bandwidth constraints.
4. Choose protocol and serialization appropriate to constraints.
5. Define topic, route, or endpoint naming.
6. Configure persistence, QoS, and acknowledgement semantics.
7. Apply payload size limits and compression only when justified.
8. Implement reconnect, retry, and backpressure.
9. Secure identities and transport.
10. Load-test under degraded links and broker outages.

## Decision points
Prefer asynchronous messaging for decoupling and intermittent links. Prefer request-response when immediate acknowledgement and simple semantics are more important than disconnection tolerance.

## Common failure patterns
- Oversized chatty payloads
- Assuming QoS equals end-to-end exactly-once
- Missing backpressure
- Topic explosion
- Retry storms after reconnect

## Verification
Verify throughput, loss, duplicates, ordering, reconnect behavior, memory use, and broker recovery under realistic fault injection.

## Expected output
A protocol and messaging design with delivery semantics, naming, resilience, and security rules.

## Stop conditions
Stop when delivery semantics or network constraints are unspecified enough to make protocol selection arbitrary.