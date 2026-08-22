# Privacy Threat Modeling

## Purpose
Identify privacy harms and misuse paths that traditional security threat models may miss.

## When to use
Use for identity, location, communications, profiling, AI, telemetry, sharing, and sensitive-data features.

## Inputs
Data flows, actors, user expectations, system architecture, abuse scenarios, and privacy objectives.

## Context to inspect
Inspect observation points, correlation identifiers, insiders, administrators, recipients, inference paths, and power asymmetries.

## Core knowledge
Confidentiality is only one privacy property. Threats include unwanted linkage, identification, surveillance, inference, disclosure, exclusion, and loss of control even without a security breach.

## Procedure
1. Define subjects and privacy objectives.
2. Map observable data and metadata.
3. Identify actors and capabilities.
4. Enumerate misuse, inference, linkage, and disclosure paths.
5. Assess impact on affected people, not only the organization.
6. Rank threats by feasibility and severity.
7. Select minimization, separation, access, transparency, and user-control mitigations.
8. Convert mitigations into tests.
9. Track residual risks and owners.

## Decision points
Remove data flows when possible; detective controls are weaker than preventing unnecessary observation.

## Common failure patterns
Reusing STRIDE mechanically, ignoring metadata, assuming employees are always trusted, and measuring only breach probability.

## Verification
Confirm high-impact privacy harms have explicit controls and test evidence.

## Expected output
A prioritized privacy threat model tied to engineering actions.

## Stop conditions
Escalate unresolved high-impact harms or processing that cannot be made proportionate.