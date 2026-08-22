# Chaos and Failure Testing

## Purpose
Validate reliability assumptions by introducing controlled failures before real incidents expose them.

## When to use
Use for critical services, failover validation, dependency resilience, autoscaling review, and after architecture changes. Do not run uncontrolled experiments in production without guardrails and approval.

## Inputs
Architecture, SLOs, failure hypotheses, rollback plan, observability, dependency map, traffic profile, and blast-radius controls.

## Preconditions
Monitoring, stop conditions, owners, and a safe abort mechanism must exist.

## Context to inspect
Redundancy, health checks, failover logic, queue recovery, retries, connection pools, regional routing, state replication, and autoscaling.

## Core knowledge
Chaos engineering tests hypotheses about system behavior under failure. The goal is not random breakage; it is evidence that specific reliability properties hold under bounded experiments.

## Procedure
1. Define a hypothesis tied to a reliability requirement.
2. Establish steady-state metrics and acceptable deviation.
3. Select the smallest representative failure.
4. Define blast radius, duration, abort thresholds, and owners.
5. Verify observability before injecting failure.
6. Run in a lower environment first when practical.
7. Execute the experiment and capture a timeline.
8. Observe user impact, recovery, and secondary effects.
9. Abort immediately when stop thresholds are crossed.
10. Record violated assumptions and remediation work.
11. Repeat after fixes to prove improvement.

## Decision points
Prefer synthetic or staging experiments when production risk is not justified; use production only when environment differences make lower-level validation insufficient and safeguards are strong.

## Common failure patterns
Testing without a hypothesis, no abort mechanism, overly broad blast radius, injecting multiple failures simultaneously, and declaring success without measuring user-facing behavior.

## Verification
Confirm the expected failure was actually injected, telemetry captured the event, recovery matched the hypothesis, and discovered weaknesses have owned remediation.

## Expected output
Experiment plan, evidence, observed behavior, gaps, and verified remediation actions.

## Stop conditions
Stop on unexpected customer impact, data-integrity risk, telemetry loss, uncertain system state, or any breach of the predefined safety envelope.