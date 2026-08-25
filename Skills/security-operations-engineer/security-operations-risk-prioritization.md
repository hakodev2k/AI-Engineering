# Security Operations Risk Prioritization

## Purpose
Prioritize alerts, engineering work and response effort using threat likelihood, business impact, exposure and confidence rather than vendor severity alone.

## When to use
Use for alert queues, detection backlogs, telemetry investments and operational roadmap decisions.

## Inputs
Asset criticality, identity privilege, exposure, threat intelligence, detection confidence, incident history, control maturity and business constraints.

## Context to inspect
Understand crown jewels, business processes, regulatory obligations, internet exposure, privileged paths and current compensating controls.

## Core knowledge
Risk is contextual. A medium-confidence alert on a domain admin may outrank a high-confidence commodity event on a disposable sandbox. Prioritization must be explainable and revisable.

## Procedure
1. Define decision being prioritized.
2. Identify impact dimensions and critical assets.
3. Estimate threat relevance and exploitability.
4. Assess evidence confidence and detection quality.
5. Account for exposure and existing controls.
6. Rank work using a documented rubric.
7. Apply urgency modifiers for active exploitation or destructive behavior.
8. Record assumptions and uncertainty.
9. Reassess when new evidence or business context arrives.
10. Review outcomes to calibrate the rubric.

## Decision points
Use quantitative scoring only when inputs are meaningful; otherwise use transparent ordinal categories. Human override should require documented rationale, not be prohibited.

## Common failure patterns
Copying CVSS/vendor severity; hidden scoring weights; ignoring identity privilege; false numerical precision; never recalibrating.

## Verification
Sample priorities and confirm they align with actual business impact and incident outcomes; document exceptions.

## Expected output
An explainable risk-prioritized queue or backlog with confidence and rationale.

## Stop conditions
Escalate when business criticality or risk ownership is unknown for potentially high-impact systems.