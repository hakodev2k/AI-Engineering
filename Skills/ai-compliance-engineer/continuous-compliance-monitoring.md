# Continuous Compliance Monitoring

## Purpose
Turn AI compliance from a point-in-time review into an operational monitoring discipline that detects drift in models, controls, vendors, data, and system behavior.

## When to use
Use for production AI systems, especially high-risk, vendor-dependent, frequently changing, or regulated deployments.

## Inputs
Control objectives, monitoring metrics, model/version telemetry, evaluation results, incident data, vendor notices, audit findings, policy thresholds.

## Preconditions
Critical controls and risk indicators have measurable signals and accountable owners.

## Context to inspect
Dashboards, model gateway telemetry, audit logs, drift metrics, safety/fairness evaluations, vendor status, change feeds, exception register, complaint data.

## Core knowledge
Compliance drift can occur without a formal release: provider model aliases may change, data distributions shift, permissions expand, controls degrade, or policy obligations evolve. Monitoring should combine technical signals with governance events and user feedback.

## Procedure
1. Identify compliance-critical assumptions and controls.
2. Define measurable indicators for each material risk.
3. Track model, prompt, data, and vendor version changes.
4. Monitor control failures and policy bypasses.
5. Include complaint, appeal, and incident signals.
6. Set thresholds tied to action, not dashboard decoration.
7. Assign owners and escalation paths.
8. Review trends and recurring exceptions.
9. Trigger reassessment when thresholds or change events occur.
10. Preserve monitoring evidence for audits and reviews.

## Decision points
Use real-time alerting for high-severity control failures; use periodic review for slower-moving governance indicators. Prefer actionable indicators over large metric inventories.

## Common failure patterns
Monitoring only infrastructure health, thresholds with no owner, ignoring vendor changes, dashboards not tied to risk, and repeated alerts that never trigger reassessment.

## Verification
Inject or replay known drift scenarios and confirm the expected alert, owner, escalation, and reassessment workflow occur.

## Expected output
A continuous compliance monitoring plan with indicators, thresholds, owners, escalation paths, evidence retention, and reassessment triggers.

## Stop conditions
Escalate when critical controls cannot be monitored, production state cannot be linked to approved versions, or monitoring shows sustained high residual risk.