# AI Readiness Assessment

## Purpose
Assess whether an organization, team, or workflow has the data, technical, operational, governance, and human conditions needed for successful AI adoption.

## When to use
Use before committing to a pilot or scaling an AI capability across teams.

## Inputs
Architecture, data landscape, security policies, user skills, process maturity, support model, governance, budget, and executive sponsorship.

## Context to inspect
Inspect identity and access, approved models/vendors, data classification, API availability, integration patterns, change processes, incident ownership, training channels, and measurement capability.

## Core knowledge
Readiness is multi-dimensional. A technically feasible AI solution can fail because users lack incentives, data is inaccessible, ownership is unclear, or policy prevents the necessary operating model.

## Procedure
1. Define the target capability and scope.
2. Assess data availability, quality, provenance, and permissions.
3. Assess integration and infrastructure constraints.
4. Review security, privacy, legal, and governance requirements.
5. Evaluate user skill, trust, incentives, and workflow fit.
6. Confirm ownership for product, operations, support, and risk.
7. Assess telemetry and evaluation capability.
8. Identify dependencies and readiness gaps.
9. Rank gaps by adoption impact and remediation effort.
10. Produce a readiness decision and remediation plan.

## Decision points
A gap may be acceptable for a sandbox pilot but blocking for production. Prefer scoped remediation over broad transformation when the use case can be safely isolated.

## Common failure patterns
Treating readiness as an infrastructure checklist, assuming policy approval, ignoring support capacity, and declaring readiness without measurable gaps.

## Verification
Each readiness conclusion must cite evidence, an owner, and a mitigation where needed. Blocking gaps must be explicit.

## Expected output
A readiness scorecard with evidence, blockers, risks, dependencies, owners, and recommended next steps.

## Stop conditions
Stop when required stakeholders cannot validate key assumptions or when policy, data, or security constraints make the target use case non-viable.