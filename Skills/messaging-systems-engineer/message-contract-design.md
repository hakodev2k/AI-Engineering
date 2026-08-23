# Message Contract Design

## Purpose
Design durable event and command contracts that can evolve independently across services.

## When to use
Use for any message exchanged across ownership or deployment boundaries.

## Inputs
Business semantics, producers, consumers, schemas, compatibility requirements and lifecycle expectations.

## Context to inspect
Existing naming, serialization, schema registry, versioning, ownership and sensitive fields.

## Core knowledge
Contracts should express stable facts or intentions, minimize coupling, carry identifiers and timestamps, and define compatibility rules explicitly.

## Procedure
1. Identify semantic owner and message purpose.
2. Separate commands from events.
3. Define required and optional fields.
4. Specify identifiers, time semantics and metadata.
5. Choose serialization and schema rules.
6. Define backward/forward compatibility policy.
7. Validate with representative consumers.
8. Document ownership and deprecation.

## Decision points
Prefer additive evolution when possible; introduce a new contract when semantics change materially rather than overloading old fields.

## Common failure patterns
Publishing database entities, ambiguous timestamps, mutable event meaning, breaking field changes and leaking secrets.

## Verification
Run schema compatibility checks and consumer contract tests against old and new payloads.

## Expected output
A versionable, documented message contract.

## Stop conditions
Stop when business semantics or compatibility obligations are unclear.