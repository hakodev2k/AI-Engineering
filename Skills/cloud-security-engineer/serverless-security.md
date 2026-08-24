# Serverless Security

## Purpose
Secure functions and event-driven managed runtimes across identity, triggers, dependencies, data, and operational boundaries.

## When to use
Use for serverless APIs, event handlers, scheduled functions, or serverless security reviews.

## Inputs
Functions, triggers, IAM roles, environment configuration, dependencies, data stores, concurrency settings, and logs.

## Context to inspect
Inspect trigger authorization, function identity, environment secrets, outbound access, event validation, dependency packages, retries, and dead-letter behavior.

## Core knowledge
Managed runtime reduces host responsibility but not application, identity, dependency, data, or event security. Event replay and excessive concurrency can become abuse vectors.

## Procedure
1. Enumerate triggers and trust levels.
2. Authenticate and authorize invocations where applicable.
3. Validate event schemas and sizes.
4. Minimize function permissions.
5. Remove static secrets.
6. Restrict network egress when justified.
7. Pin and scan dependencies.
8. Bound concurrency, retries, and execution time.
9. Protect logs from sensitive payload leakage.
10. Test malformed, duplicate, and unauthorized events.

## Decision points
Use private networking only when dependency access requires it and latency/complexity are acceptable. Choose async handling when retry semantics are understood.

## Common failure patterns
Public unauthenticated triggers, broad execution roles, secret-filled environment variables, retry storms, and trusting event source fields.

## Verification
Test authorization, malformed events, duplicate delivery, permission boundaries, and operational telemetry.

## Expected output
A bounded serverless threat surface with tested trigger, identity, and failure controls.

## Stop conditions
Escalate when trigger provenance cannot be verified or retry behavior can cause destructive duplicate effects.