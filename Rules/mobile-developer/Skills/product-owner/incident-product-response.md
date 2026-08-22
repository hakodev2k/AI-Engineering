# Product Response to Incidents

## Purpose
Support production incidents with fast product decisions about user impact, scope, mitigation, communication, and recovery while engineering leads technical response.

## When to use
Use during incidents that affect product behavior, data, transactions, availability, or customer commitments.

## Inputs
Incident symptoms, affected users, telemetry summaries, business impact, mitigation options, known risks, and recovery status.

## Context to inspect
Inspect impacted journeys, critical customers, financial or data consequences, workarounds, communication obligations, and feature controls.

## Core knowledge
During incidents, the Product Owner supplies impact prioritization and product trade-offs, not speculative debugging. Stabilization precedes feature completeness.

## Procedure
1. Confirm incident commander and communication channels.
2. Define affected product capabilities and user segments.
3. Quantify business and user impact where possible.
4. Help prioritize restoration of critical journeys.
5. Decide on product mitigations such as disabling optional functionality.
6. Clarify acceptable degraded behavior.
7. Support customer-facing communication with verified facts.
8. Avoid changing scope while technical diagnosis is unstable.
9. After recovery, review product causes and safeguards.
10. Feed validated follow-up work into prioritization.

## Decision points
Prefer safe degradation over full functionality when it reduces harm. Roll back or disable features when recovery risk is lower than continued exposure.

## Common failure patterns
Product Owner acting as incident commander without role clarity, demanding root cause before mitigation, unverified customer messaging, and automatically prioritizing every postmortem action.

## Verification
User impact is understood, product decisions are recorded, communications match verified facts, and follow-up work is prioritized by risk.

## Expected output
Clear product impact decisions during the incident and evidence-based follow-up afterward.

## Stop conditions
Escalate immediately for safety, legal, privacy, security, or material financial impact according to incident policy.