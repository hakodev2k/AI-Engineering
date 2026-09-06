# Support and Escalation Operating Model

## Purpose
Define how users receive help, how AI failures are triaged, and how issues escalate across product, engineering, operations, security, and vendors.

## When to use
Use before production rollout or when pilots generate recurring user questions, model failures, or integration incidents.

## Inputs
User segments, support channels, incident taxonomy, architecture, vendor contracts, business criticality, and ownership map.

## Context to inspect
Inspect current service desk processes, on-call ownership, issue categories, severity definitions, vendor escalation paths, known failure modes, and telemetry available to support staff.

## Core knowledge
AI support must distinguish user guidance, model-quality defects, prompt/context failures, data issues, policy incidents, integration failures, and platform outages. Without taxonomy and routing, every issue becomes an engineering escalation.

## Procedure
1. Define support entry points and supported hours.
2. Create an issue taxonomy with examples.
3. Define severity based on impact and risk.
4. Assign first-line, specialist, engineering, security, and vendor ownership.
5. Specify evidence to collect for each issue type.
6. Create escalation and handoff criteria.
7. Define user communication expectations.
8. Build known-issue and workaround guidance.
9. Measure volume, resolution time, recurrence, and escalation rate.
10. Feed recurring issues into product, training, and workflow improvements.

## Decision points
Handle predictable usage questions through self-service or frontline support. Escalate reproducible system defects, security events, widespread quality regressions, or provider failures to specialist owners.

## Common failure patterns
Sending all AI issues to developers, asking users to reproduce without trace identifiers, no severity model, hidden vendor dependencies, and failing to convert recurring tickets into fixes.

## Verification
Run tabletop cases for user error, bad model output, data outage, integration failure, and security concern; verify each routes to the correct owner with sufficient evidence.

## Expected output
A support model with taxonomy, severity, ownership, evidence requirements, SLAs, escalation paths, and feedback loops.

## Stop conditions
Stop when critical incident ownership or vendor escalation rights remain undefined.