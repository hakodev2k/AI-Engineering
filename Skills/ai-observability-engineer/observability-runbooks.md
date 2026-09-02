# Observability Runbooks

## Purpose
Create executable runbooks that turn AI alerts and symptoms into bounded, evidence-based diagnostic actions.

## When to use
Use when operationalizing new alerts, recurring incidents, or onboarding responders to AI systems.

## Inputs
Alerts, dashboards, service topology, access model, known failure modes, mitigation controls, and escalation paths.

## Context to inspect
Inspect historical incidents, provider dependencies, routing/fallback controls, model/config rollback, index freshness, queues, quotas, and sensitive-data boundaries.

## Core knowledge
A runbook should reduce decision latency without pretending every incident has one cause. It must distinguish safe read-only diagnostics from changes requiring approval and include evidence for recovery.

## Procedure
1. Start with the exact alert/symptom and user impact it represents.
2. Link authoritative dashboards and queries.
3. Define first checks for telemetry health, SLO impact, affected cohorts, and recent changes.
4. Provide branching diagnostics for provider, retrieval, tool/agent, capacity, configuration, and application failures as relevant.
5. Mark every mitigation with risk, prerequisites, and rollback.
6. Define escalation owners and required evidence.
7. Define recovery verification and when to keep monitoring.
8. Test the runbook in a tabletop or game-day exercise.
9. Update it after incidents and platform changes.

## Decision points
Automate read-only evidence collection aggressively; automate mitigation only when preconditions and rollback are deterministic.

## Common failure patterns
Stale links, commands without scope, dangerous changes presented as routine, no escalation threshold, no recovery criteria, and runbooks that assume one provider/model.

## Verification
Have a responder unfamiliar with the incident execute a tabletop scenario and measure whether the runbook leads to correct evidence and safe action.

## Expected output
A concise, tested runbook with diagnostics, decision branches, mitigations, escalation, and recovery checks.

## Stop conditions
Stop execution when required permissions are absent, mitigation is destructive, or evidence contradicts the runbook assumptions.