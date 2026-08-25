# SOC Operational Readiness

## Purpose
Assess whether a new system, security control or detection capability can be operated effectively before production launch.

## When to use
Use before onboarding major applications, cloud environments, EDR/SIEM features, detections or response automations.

## Inputs
Architecture, threat model, telemetry, detections, runbooks, ownership, on-call model, access, SLOs and failure scenarios.

## Context to inspect
Review production topology, critical dependencies, data sensitivity, support boundaries, maintenance process and emergency contacts.

## Core knowledge
A control is not operationally ready merely because it is installed. Readiness requires observability, ownership, response authority, tested procedures and known failure behavior.

## Procedure
1. Identify high-risk threat scenarios and assets.
2. Confirm required telemetry exists with health monitoring.
3. Validate detections end-to-end.
4. Ensure alerts contain sufficient triage context.
5. Test analyst access and least-privilege permissions.
6. Review runbooks, escalation and on-call ownership.
7. Exercise representative incident scenarios.
8. Test automation failures and rollback.
9. Define operational metrics and support expectations.
10. Record accepted gaps and risk owners.
11. Approve launch only when critical gaps have owners and controls.

## Decision points
Block launch for gaps that prevent detection/containment of high-impact scenarios; accept lower-risk gaps only through explicit risk ownership.

## Common failure patterns
Tool-installed-equals-ready thinking; untested paging; missing service owner; no telemetry health; inaccessible logs during incidents.

## Verification
Execute readiness scenarios and confirm people, telemetry, detections, permissions and response paths function together.

## Expected output
Readiness decision with evidence, residual gaps, owners and launch conditions.

## Stop conditions
Do not approve when critical telemetry, response ownership, access or escalation is absent.