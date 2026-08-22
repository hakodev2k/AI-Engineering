# Chaos Experiment Design

## Purpose
Design controlled experiments that test whether a system survives realistic failures without creating unacceptable business risk.

## When to use
Use when validating resilience assumptions, preparing critical services for production, or investigating weak recovery behavior. Do not inject faults without explicit scope and safeguards.

## Inputs
Architecture, dependencies, SLOs, incident history, traffic patterns, recovery mechanisms, and business criticality.

## Context to inspect
Review service topology, failure domains, observability, rollback paths, on-call readiness, data integrity constraints, and existing resilience controls.

## Core knowledge
Chaos engineering tests hypotheses about steady-state behavior. Experiments should be bounded, observable, reversible, and progressively realistic.

## Procedure
1. Define the steady-state signals that represent acceptable service behavior.
2. State a falsifiable resilience hypothesis.
3. Select one realistic failure mode.
4. Define blast radius, duration, abort thresholds, and owners.
5. Confirm telemetry can detect both injected faults and user impact.
6. Rehearse rollback or fault removal.
7. Run first in the safest representative environment.
8. Observe system and dependency behavior.
9. Stop immediately when abort criteria trigger.
10. Record evidence, weaknesses, and remediation work.
11. Repeat only after material findings are addressed.

## Decision points
Prefer narrow experiments when failure consequences are uncertain. Increase realism only when previous stages prove controls work. Production experiments are justified only when lower environments cannot reproduce important behavior.

## Common failure patterns
Injecting faults without hypotheses, measuring only infrastructure health, excessive blast radius, missing abort criteria, testing during unrelated incidents, and repeating experiments without fixing findings.

## Verification
Verify the injected failure occurred, telemetry captured it, expected resilience controls activated, user-facing impact stayed within thresholds, and recovery completed cleanly.

## Expected output
An experiment plan and evidence-backed result with remediation actions.

## Stop conditions
Stop for unexpected data risk, breached abort thresholds, degraded observability, unrelated production instability, or loss of fault-control capability.