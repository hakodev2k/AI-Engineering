# Detection Coverage Management

## Purpose
Manage detection coverage against realistic threat behaviors, critical assets and available telemetry rather than counting rules.

## When to use
Use for SOC roadmap planning, control reviews, ATT&CK mapping and prioritizing engineering work.

## Inputs
Threat model, ATT&CK mappings, detection inventory, telemetry matrix, asset criticality, incidents and intelligence.

## Context to inspect
Validate each claimed mapping against actual rule logic and data availability. Identify environment-specific attack paths and crown-jewel systems.

## Core knowledge
One rule may partially cover a technique; many rules may cover the same behavior. Coverage must include observability, detection quality and response capability.

## Procedure
1. Define prioritized threat scenarios.
2. Map attacker behaviors to required telemetry.
3. Inventory detections and evidence of validation.
4. Grade coverage as absent, theoretical, partial, validated or operationally mature.
5. Identify telemetry and response gaps separately.
6. Prioritize gaps by likelihood, impact and feasibility.
7. Create engineering backlog with owners.
8. Validate new coverage with testing.
9. Reassess after incidents, architecture changes and intelligence shifts.

## Decision points
Prefer depth on high-risk attack paths over superficial breadth. Accept documented gaps when mitigation cost exceeds risk and compensating controls are proven.

## Common failure patterns
Counting ATT&CK technique tags; claiming coverage from disabled data; ignoring cloud/SaaS identities; no validation evidence.

## Verification
Sample mappings and prove telemetry, rule behavior, alert routing and response runbook exist and function.

## Expected output
Evidence-backed coverage matrix and prioritized improvement backlog.

## Stop conditions
Escalate when risk ownership is unclear or required business/asset context is unavailable.