# IPC Design

## Purpose
Design robust, secure, evolvable inter-process contracts for browser subsystems.

## When to use
Use when adding IPC, moving work across processes, diagnosing message ordering, or reducing synchronous dependencies.

## Inputs
Data flow, ownership model, message schema, trust model, latency requirements.

## Context to inspect
Sender/receiver lifetimes, sequencing, serialization, validation, disconnect handling, versioning, synchronous calls.

## Core knowledge
IPC is an API across failure and trust boundaries. Messages can arrive late, peers can disconnect, serialized data is untrusted when crossing privilege boundaries, and round trips amplify latency.

## Procedure
1. Define the minimum contract and authoritative owner.
2. Specify trust assumptions for each field.
3. Make sequencing and response correlation explicit.
4. Design cancellation and peer-disconnect behavior.
5. Validate sizes, enums, identifiers, and capabilities at receiver.
6. Avoid synchronous IPC on critical paths.
7. Instrument latency and failure rates.
8. Test malformed messages, reordering where allowed, shutdown, and crash.

## Decision points
Prefer one-way messages for notifications, request/response for required results, and shared memory only for justified high-volume data with strict validation.

## Common failure patterns
Chatty protocols; hidden sync waits; trusting sender validation; unbounded payloads; callbacks after disconnect; duplicated authority.

## Verification
Contract tests, malformed-input tests, process-crash tests, and IPC latency measurements pass.

## Expected output
A minimal IPC contract with explicit security, lifecycle, and performance semantics.

## Stop conditions
Stop when ownership is ambiguous or the design would expose a generic privileged primitive to untrusted peers.