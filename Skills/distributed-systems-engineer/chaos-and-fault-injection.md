# Chaos and Fault Injection

## Purpose
Validate resilience assumptions by introducing controlled failures and observing whether the system behaves within defined safety and recovery boundaries.

## When to use
Use after failure behavior is designed and observable, especially for critical distributed dependencies and recovery paths.

## Inputs
Failure model, SLOs, architecture, rollback controls, blast-radius limits, and incident procedures.

## Preconditions
Have baseline telemetry, explicit hypotheses, owners, and a rapid abort mechanism.

## Context to inspect
Inspect production/staging parity, redundancy, dependency topology, alerting, on-call readiness, and previous incidents.

## Core knowledge
Chaos engineering is hypothesis-driven verification, not random destruction. Start with small blast radius and test one failure assumption at a time.

## Procedure
1. State a measurable steady-state hypothesis.
2. Choose one realistic failure mode.
3. Define blast radius, duration, abort thresholds, and owner.
4. Verify monitoring and rollback before injection.
5. Run first in the safest representative environment.
6. Inject latency, errors, process loss, partition, resource pressure, or dependency failure as appropriate.
7. Observe user impact and recovery.
8. Stop immediately if abort criteria trigger.
9. Record gaps and remediate them.
10. Repeat after fixes and periodically for critical paths.

## Decision points
Use production experiments only when controls, observability, and organizational risk tolerance justify them; otherwise use representative pre-production environments.

## Common failure patterns
No hypothesis, excessive blast radius, testing without on-call awareness, hidden automation that fights the experiment, and celebrating survival without checking data correctness.

## Verification
Compare observed behavior with the hypothesis, SLOs, data invariants, and recovery expectations.

## Expected output
Evidence-backed resilience findings and prioritized remediation.

## Stop conditions
Abort on safety threshold breach, unexpected data risk, uncontrolled propagation, or inability to observe system state.