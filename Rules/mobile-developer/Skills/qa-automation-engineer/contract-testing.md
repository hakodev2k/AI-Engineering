# Contract Testing

## Purpose
Detect incompatible changes between independently evolving services before deployment.

## When to use
Use for service-to-service APIs, events, shared schemas, or external integrations where producer and consumer releases are decoupled.

## Inputs
Consumer expectations, provider contract, schemas, version policy, deployment topology.

## Context to inspect
Actual fields consumed, optionality, enums, error responses, event evolution, compatibility rules, and provider verification environment.

## Core knowledge
Consumer-driven contracts prove specific expectations; schema contracts prove structural compatibility. Contracts complement—not replace—integration tests. Favor additive evolution and explicit compatibility policies.

## Procedure
1. Identify producer-consumer relationships.
2. Capture only behavior consumers genuinely rely on.
3. Version and publish contracts through controlled workflow.
4. Verify providers against current supported contracts.
5. Test error and edge interactions where they are contractual.
6. Add compatibility checks to producer CI.
7. Gate deployment when a supported consumer would break.
8. Define deprecation and consumer migration process.
9. Keep a small number of end-to-end integration checks for infrastructure assumptions.

## Decision points
Use consumer-driven contracts for independently owned services; schema compatibility may suffice for stable event platforms. Avoid contracts for internal implementation details.

## Common failure patterns
Over-specified payloads, stale consumers, contracts generated from provider code only, ignoring error behavior, treating contract success as proof of network/infrastructure integration.

## Verification
Introduce a deliberate breaking change and confirm CI blocks it; verify supported consumer versions and deployment checks.

## Expected output
Executable compatibility evidence and a clear contract lifecycle.

## Stop conditions
Escalate when ownership, supported versions, or compatibility guarantees are undefined.