# Event Modeling

## Purpose
Design event-driven systems around meaningful business facts rather than transport-specific messages.

## When to use
Use when introducing events, decomposing workflows, or correcting brittle event contracts. Do not use events merely to replace simple in-process calls.

## Inputs
Requirements, domain terminology, existing APIs/events, data ownership, consumers, latency and consistency needs.

## Context to inspect
Map business capabilities, transaction boundaries, producers, consumers, current schemas, failure handling, and operational constraints before proposing events.

## Core knowledge
Events represent immutable facts that already happened. Commands request action. Notifications may carry less semantic authority. Good event boundaries follow domain ownership and minimize coupling. Event payloads must balance consumer autonomy against duplication and privacy.

## Procedure
1. Identify the business outcome and actors.
2. Build the timeline of state transitions.
3. Name facts in past tense using domain language.
4. Separate commands, events, and queries.
5. Assign exactly one authoritative producer per fact where possible.
6. Identify required consumers and their independent reactions.
7. Define minimum stable event semantics and identifiers.
8. Record ordering, duplication, latency, retention, and privacy requirements.
9. Test the model against failure, replay, and future-consumer scenarios.
10. Document ownership and evolution rules.

## Decision points
Prefer synchronous interaction when the caller requires an immediate authoritative result. Prefer events when downstream reactions can be decoupled, multiple consumers need the fact, or temporal history matters. Avoid events that expose internal entity mutations without durable business meaning.

## Common failure patterns
CRUD-shaped events, ambiguous ownership, event names tied to implementation, oversized snapshots, missing correlation IDs, treating delivery as exactly once, and leaking sensitive fields.

## Verification
Walk representative workflows end to end; confirm every event has clear semantics, producer, identifiers, consumers, consistency expectations, and failure behavior. Validate schemas with consumer tests.

## Expected output
An event model with event definitions, ownership, lifecycle, constraints, and rationale.

## Stop conditions
Stop when domain semantics are unresolved, ownership is disputed, regulated data handling is unclear, or the required consistency model cannot be established safely.