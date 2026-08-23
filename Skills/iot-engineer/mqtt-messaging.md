# MQTT Messaging

## Purpose
Design reliable MQTT communication for constrained devices and large fleets.

## When to use
Use for telemetry, commands, state propagation, and asynchronous device-cloud messaging.

## Inputs
Topic model, payloads, delivery guarantees, broker limits, fleet size, connectivity behavior.

## Context to inspect
Broker configuration, ACLs, client libraries, retained messages, sessions, QoS, telemetry rates, and command semantics.

## Core knowledge
MQTT QoS controls delivery attempts, not business-level exactly-once effects. Topic design, retained state, persistent sessions, expiry, and idempotency determine operational correctness.

## Procedure
1. Classify telemetry, events, commands, and desired/reported state.
2. Design stable hierarchical topics.
3. Apply least-privilege publish/subscribe ACLs.
4. Select QoS per message class.
5. Define payload versioning and size limits.
6. Add message IDs and idempotency where side effects exist.
7. Configure reconnect, backoff, session and expiry behavior.
8. Test duplicates, reordering, disconnects, stale retained data, and broker failover.

## Decision points
Use QoS 0 for disposable high-rate telemetry, QoS 1 for important messages with idempotent consumers, and higher guarantees only when their overhead is justified.

## Common failure patterns
Wildcard ACLs, topic explosion, retained commands, assuming ordering across topics, and retry storms.

## Verification
Exercise loss, duplicate delivery, reconnect, authorization denial, stale messages, and peak fleet load.

## Expected output
A secure topic contract and tested MQTT delivery strategy.

## Stop conditions
Escalate when command semantics can create unsafe physical effects without stronger end-to-end guarantees.