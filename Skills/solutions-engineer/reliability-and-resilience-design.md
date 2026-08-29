# Reliability and Resilience Design

## Purpose
Design failure handling, redundancy, recovery, and degraded behavior that meet business reliability expectations.

## When to use
Use for production architectures where dependency or component failure can affect critical outcomes.

## Inputs
Availability targets, dependencies, topology, state model, RTO/RPO, failure history, operational capabilities.

## Context to inspect
Failure domains, health checks, retries, timeouts, queues, replication, backups, failover, deployment risk, and manual recovery steps.

## Core knowledge
Reliability requires controlling blast radius and recovery, not simply duplicating components. Retries can amplify incidents; redundancy without independent failure domains is weak protection.

## Procedure
1. Define user-visible reliability objectives.
2. Map dependencies and failure domains.
3. Identify single points of failure.
4. Define timeout, retry, circuit-breaking, and backpressure policies.
5. Design redundancy and failover.
6. Define recovery and data-loss objectives.
7. Specify degraded modes and operational runbooks.
8. Test representative failure scenarios.

## Decision points
Use active-active where continuity and scale justify consistency/complexity costs; use active-passive where simpler recovery satisfies objectives.

## Common failure patterns
Retry storms, correlated redundancy, untested failover, impossible RTOs, and health checks that do not reflect user service.

## Verification
Failure tests demonstrate bounded impact and recovery within agreed objectives.

## Expected output
A resilience design tied to measurable reliability goals.

## Stop conditions
Stop when required objectives cannot be met by the available architecture or operational model.