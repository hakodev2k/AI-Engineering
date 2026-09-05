# Chaos and Fault Injection

## Purpose
Validate that AI systems remain bounded, observable, and recoverable when dependencies fail or degrade.

## When to use
Use before critical launches, after resilience changes, and to reproduce production failure modes in controlled environments.

## Inputs
Architecture, failure hypotheses, dependency map, safe test environment, SLOs, fallback controls, monitoring.

## Preconditions
Experiments are isolated or explicitly approved, have abort criteria, and cannot trigger uncontrolled external side effects.

## Context to inspect
Model providers, retrieval stores, queues, tool APIs, network paths, autoscaling, feature flags, circuit breakers, failover routes.

## Core knowledge
Chaos testing is hypothesis-driven reliability validation, not random breakage. AI systems require faults covering latency, invalid model output, schema drift, quota errors, retrieval absence, tool failure, and partial provider degradation.

## Procedure
1. Define a precise reliability hypothesis.
2. Choose the smallest fault that tests it.
3. Establish steady-state metrics and safety limits.
4. Ensure rollback and abort controls work.
5. Inject one failure dimension at a time initially.
6. Observe detection, containment, degradation, and recovery.
7. Measure SLO impact and operator response.
8. Fix uncovered weaknesses.
9. Repeat the exact experiment.
10. Add proven scenarios to recurring resilience tests.

## Decision points
Use mocks for deterministic control-path testing and real dependency failure exercises when integration behavior matters. Expand blast radius only after smaller tests are safe.

## Common failure patterns
No hypothesis, testing only total outages, missing abort controls, side effects reaching production systems, and declaring success because the service returned any response.

## Verification
The experiment demonstrates expected alerts, bounded impact, safe fallback, and recovery within defined objectives.

## Expected output
A fault-injection scenario, hypothesis, observed results, discovered gaps, remediation, and repeatable test.

## Stop conditions
Abort when safety limits are crossed, production impact exceeds authorization, or observability is insufficient to judge the experiment.