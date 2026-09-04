# Federated Production Incident Response

## Purpose
Investigate and contain production incidents in federated training while preserving privacy, evidence, model integrity, and recoverability.

## When to use
Use for stalled rounds, participation collapse, model-quality regression, anomalous updates, privacy-control failures, client crashes, coordinator outages, or suspicious poisoning behavior.

## Inputs
Incident timeline, model/config versions, round telemetry, client failure aggregates, deployment changes, security alerts, privacy logs, and rollback options.

## Context to inspect
Inspect recent releases, client eligibility, coordinator state, aggregation behavior, update statistics, network health, version skew, and whether the incident affects confidentiality, integrity, availability, or model quality.

## Core knowledge
FL incidents cross ML and distributed-systems boundaries. Response must avoid collecting prohibited client data under pressure. Containment may mean pausing training, rejecting a client cohort/version, rolling back a model, or disabling personalization rather than debugging live indefinitely.

## Procedure
1. Classify severity and affected dimensions: privacy, security, quality, availability, or cost.
2. Freeze relevant model, config, and round identifiers.
3. Check recent deployments and protocol/model changes.
4. Compare participation, failure reasons, latency, update norms, and quality to baseline.
5. Isolate client-, network-, coordinator-, and optimization-layer hypotheses.
6. Contain risk with bounded actions such as pausing rounds or rolling back.
7. Preserve approved evidence without expanding telemetry scope ad hoc.
8. Reproduce using simulator or test clients where possible.
9. Apply the smallest corrective change and verify against the failure signature.
10. Document root cause, contributing factors, detection gaps, and prevention actions.

## Decision points
Rollback immediately for credible privacy/security violations or severe global-quality regressions. Continue degraded service only when risk is bounded and observable. Escalate cryptographic or regulatory incidents to the appropriate owners.

## Common failure patterns
- Retrying failed rounds indefinitely.
- Collecting sensitive raw client data for debugging.
- Changing multiple variables during diagnosis.
- Confusing data drift with infrastructure failure.
- No model/config provenance.

## Verification
Confirm the failure signature disappears, recovery holds across subsequent rounds, quality/privacy guardrails pass, and incident actions are auditable.

## Expected output
An incident record with impact, evidence, containment, root cause, fix, verification, and follow-up controls.

## Stop conditions
Stop normal troubleshooting and escalate when privacy guarantees may have been violated, malicious activity is suspected, destructive remediation is required, or evidence is insufficient for a safe change.