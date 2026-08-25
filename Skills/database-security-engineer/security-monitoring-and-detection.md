# Security Monitoring and Detection

## Purpose
Detect suspicious database behavior using actionable signals tied to response procedures.

## When to use
Use when building detections, onboarding databases to monitoring, tuning alerts, or after incidents.

## Inputs
Audit logs, authentication logs, query telemetry, network events, asset criticality, identity context, and incident playbooks.

## Context to inspect
Establish normal administrative windows, application identities, expected source networks, sensitive objects, and existing alert routing.

## Core knowledge
Useful detections combine behavior, context, and asset sensitivity. Static thresholds alone often create noise. Detection must preserve enough evidence for triage without collecting unnecessary sensitive data.

## Procedure
1. Define high-value attack scenarios.
2. Map each scenario to observable signals.
3. Establish baselines for normal behavior.
4. Build detections for anomalous access, privilege changes, brute force, unusual exports, and audit tampering as relevant.
5. Add identity and asset context.
6. Define severity and response owner.
7. Test with safe simulations.
8. Tune false positives and measure missed coverage.
9. Review detections after platform changes and incidents.

## Decision points
Prefer high-confidence alerts for paging and lower-confidence analytics for investigation. Behavioral models require stable telemetry and drift management.

## Common failure patterns
Alerts without owners, noisy query-volume thresholds, missing service-account context, detection gaps during log outages, and storing full sensitive query payloads unnecessarily.

## Verification
Simulate representative events and confirm alert creation, enrichment, routing, and responder comprehension.

## Expected output
A tested detection set linked to response actions and coverage assumptions.

## Stop conditions
Escalate if telemetry integrity is uncertain or testing could affect production availability.