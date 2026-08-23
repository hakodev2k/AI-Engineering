# Production Safety and Test Control

## Purpose
Execute authorized security testing against sensitive or production-like systems with explicit controls that minimize availability, integrity, cost, and customer risk.

## When to use
Use whenever active testing can affect live services, shared infrastructure, financial operations, rate-sensitive APIs, or fragile systems.

## Inputs
Rules of engagement, critical assets, maintenance windows, rate constraints, monitoring contacts, rollback paths, and test-data strategy.

## Context to inspect
Inspect SLOs, autoscaling/cost behavior, downstream side effects, queues, third parties, alerting, backups, transaction irreversibility, and known fragile components.

## Core knowledge
Security testing is an operational change. Concurrency, payload size, retries, state mutation, and dependency fan-out can create disproportionate impact. Safety controls must be designed before execution.

## Procedure
1. Classify planned techniques by operational risk.
2. Identify blast radius and downstream side effects.
3. Establish explicit target allowlists and rate/concurrency caps.
4. Prefer test accounts/data and reversible operations.
5. Coordinate monitoring and emergency contacts.
6. Start with a canary target/request.
7. Increase coverage gradually while observing health signals.
8. Pause on anomalous latency, errors, cost, or alerts.
9. Roll back test state and confirm service health.
10. Record incidents or near misses for future engagement controls.

## Decision points
Move intrusive techniques to staging when production evidence is not essential. Reduce proof depth when the security conclusion is already established.

## Common failure patterns
Unlimited scanner concurrency, retry storms, triggering real notifications/payments, ignoring downstream APIs, testing during peak events, and lacking a kill switch.

## Verification
Confirm no unintended persistent state, service health remains normal, test resources are cleaned up, and monitoring shows no unexplained impact.

## Expected output
A controlled execution record with safety limits, observed health, cleanup, and any deviations.

## Stop conditions
Immediately stop on instability, unexpected customer impact, uncontrolled cost, destructive state, or loss of monitoring/rollback capability.