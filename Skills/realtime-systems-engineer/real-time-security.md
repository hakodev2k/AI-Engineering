# Real-Time Security

## Purpose
Apply security controls without violating timing guarantees, and account for attacks that exploit scheduling, resource exhaustion, malformed input, or time synchronization.

## When to use
Use for authenticated control traffic, secure boot/update, exposed interfaces, untrusted inputs, multi-tenant hardware, or security controls added to critical paths.

## Inputs
Threat model, timing budgets, interfaces, cryptographic requirements, trust boundaries, resource limits, update mechanism.

## Context to inspect
Authentication, authorization, crypto libraries, key storage, parsers, network queues, rate limits, privilege boundaries, secure boot, and update path.

## Core knowledge
Security work can add variable CPU, memory, and I/O cost. Denial-of-service is particularly relevant to real-time systems because resource starvation can become a safety or availability failure. Cryptographic verification and parsing need bounded placement.

## Procedure
1. Map trust boundaries and attacker-controlled inputs.
2. Identify attacks that can consume CPU, memory, queues, bandwidth, or lock time.
3. Authenticate and validate before expensive processing where possible.
4. Bound parser and cryptographic work on critical paths.
5. Add rate limits and admission control with criticality-aware exceptions.
6. Isolate keys and privileged operations.
7. Define secure update with rollback and recovery semantics.
8. Test malformed, replayed, burst, and unauthorized traffic.
9. Re-run timing analysis with security controls enabled.

## Decision points
Move expensive security work off critical paths only if trust and freshness remain valid. Hardware crypto may reduce latency but adds platform dependence and queue contention.

## Common failure patterns
Unbounded certificate chains, expensive authentication before rate limiting, insecure debug interfaces, shared queues for trusted/untrusted traffic, and security logging that causes deadline misses.

## Verification
Run security tests and worst-case timing tests together, including hostile traffic and failed-authentication storms.

## Expected output
A threat-informed security design with bounded resource cost, isolation decisions, and timing evidence.

## Stop conditions
Stop when a required security control cannot meet timing constraints without changing architecture or approved risk posture.