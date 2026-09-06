# AI Incident Containment

## Purpose
Contain active AI security incidents while minimizing additional harm, evidence loss, and unnecessary service disruption.

## When to use
Use after credible evidence of compromised identities, unauthorized retrieval, tool misuse, secret exposure, malicious automation, provider compromise, or other active AI-system abuse.

## Inputs
Incident scope, affected principals, systems, models, tools, credentials, data, current traffic, dependencies, business criticality, and available containment controls.

## Preconditions
An incident owner exists and responders know which actions require operational, security, legal, or executive approval.

## Context to inspect
Review kill switches, account controls, API-key rotation, model gateway rules, tool permissions, network boundaries, retrieval indexes, feature flags, provider routes, and rollback options.

## Core knowledge
Containment is a risk trade-off. The fastest control may have the widest blast radius. Prefer reversible, scoped controls that stop attacker capability while preserving evidence and essential operations.

## Procedure
1. Confirm the threat and identify currently exploitable capabilities.
2. Prioritize stopping irreversible or high-impact actions.
3. Select the narrowest effective containment control.
4. Preserve relevant evidence before destructive changes when safe.
5. Revoke or rotate compromised credentials.
6. Restrict affected tools, models, data sources, sessions, or tenants as needed.
7. Add temporary detection and blocking rules for known indicators.
8. Validate that malicious activity stops.
9. Monitor for displacement to alternate accounts, providers, endpoints, or tools.
10. Document every action, timestamp, owner, rationale, and rollback condition.

## Decision points
Disable a whole service only when narrower controls cannot contain material risk. Rotate shared credentials cautiously when dependent workloads may fail. Preserve read-only access for investigation where practical.

## Common failure patterns
Overbroad shutdowns, rotating credentials without updating dependencies, deleting evidence, assuming blocked identities cannot re-enter elsewhere, and failing to verify containment.

## Verification
Implemented means containment actions were executed. Verified means telemetry shows the malicious capability is no longer usable and legitimate critical paths behave as expected.

## Expected output
Containment record, affected assets, controls applied, validation evidence, residual risks, and rollback criteria.

## Stop conditions
Escalate when containment could cause major business outage, cross-tenant impact, legal preservation concerns, or when the attacker retains an unknown persistence path.