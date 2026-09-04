# Reliability Validation and Game Days

## Purpose
Validate that ML reliability controls actually work by exercising realistic failures, operator responses, fallbacks, alerts, and recovery paths before they are needed in a real incident.

## When to use
Use before critical launches, after adding major dependencies or fallback mechanisms, following serious incidents, and periodically for mature production ML systems.

## Inputs
- Architecture and dependency map
- SLOs and failure-mode analysis
- Runbooks and escalation paths
- Fallback and rollback mechanisms
- Test environment and fault-injection capabilities

## Context to inspect
Inspect critical prediction journeys, model and feature dependencies, data freshness, alert routing, operator permissions, recovery objectives, stateful components, and risks of fault injection.

## Core knowledge
Documentation does not prove recoverability. Game days convert reliability assumptions into evidence by injecting controlled faults such as stale features, dependency latency, corrupted inputs, serving saturation, failed retraining, bad model releases, or unavailable registries. Experiments must have bounded blast radius and explicit abort criteria.

## Procedure
1. Select high-priority failure modes from incident history and risk analysis.
2. Define the hypothesis, expected system behavior, success criteria, and abort conditions for each scenario.
3. Choose an isolated or safely scoped environment and obtain required operational approvals.
4. Capture baseline service, data, and model-quality telemetry.
5. Inject one controlled fault at a time.
6. Observe whether alerts fire with sufficient context and whether ownership is clear.
7. Execute the documented fallback, mitigation, or rollback without hidden assistance.
8. Measure detection time, mitigation time, recovery time, data integrity, and residual user impact.
9. Restore normal operation and verify all temporary fault mechanisms are removed.
10. Record unexpected behavior, missing telemetry, permission gaps, and runbook ambiguity.
11. Convert findings into owned remediation work and repeat failed scenarios after fixes.
12. Maintain a recurring portfolio of scenarios as architecture and risks evolve.

## Decision points
Use production only when fault scope is tightly bounded and the learning value cannot be achieved safely elsewhere. Prefer tabletop exercises for destructive scenarios that cannot be injected safely. Prioritize scenarios with high severity and weakly evidenced controls.

## Common failure patterns
- Declaring success because the system eventually recovered without measuring objectives.
- Operators know hidden test details that make the scenario unrealistic.
- Fault injection affects unrelated users or systems.
- Alerts fire but lack actionable model or feature context.
- Findings are documented but never remediated or retested.
- Recovery restores serving while data or model quality remains unhealthy.

## Verification
Verify each exercised scenario has recorded evidence for detection, containment, fallback or rollback, recovery, telemetry, and cleanup. Re-run previously failed scenarios and confirm corrective actions close the observed gap.

## Expected output
A game-day report containing scenarios, hypotheses, measured outcomes, control effectiveness, discovered gaps, assigned remediations, and retest evidence.

## Stop conditions
Abort immediately if blast radius exceeds the approved scope, data integrity is threatened, a safety constraint is crossed, recovery controls fail, or operators cannot confidently restore the system.