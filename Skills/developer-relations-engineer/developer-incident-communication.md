# Developer Incident Communication

## Purpose
Provide technically accurate, timely developer communication during outages or regressions without interfering with incident command.

## When to use
Use when an incident affects APIs, SDKs, developer tooling, authentication, quotas, webhooks, or other developer-facing services.

## Inputs
Incident commander updates, status data, affected surfaces, symptoms, mitigations, support signals, approved communication policy.

## Preconditions
Know the incident communication authority and do not speculate beyond confirmed information.

## Context to inspect
Affected regions/versions, start time, symptoms, workarounds, data integrity risk, retry behavior, status page, and update cadence.

## Core knowledge
During incidents, developer guidance must prioritize safe action. Incorrect retry advice can amplify overload; premature root-cause claims damage trust and incident response.

## Procedure
1. Establish the authoritative incident source and liaison.
2. Translate confirmed impact into developer-observable symptoms.
3. State affected scope and known unaffected scope only when verified.
4. Provide safe mitigation/workaround approved by incident owners.
5. Warn against harmful retry or failover behavior where relevant.
6. Keep timestamps and update cadence explicit.
7. Route new evidence to incident command rather than independently diagnosing publicly.
8. Correct prior statements visibly if facts change.
9. After resolution, update recovery guidance and link the postmortem when available.
10. Feed recurring confusion into docs/tooling improvements.

## Decision points
Say “investigating” rather than hypothesize. Prefer no workaround over an unsafe one. Use targeted channels for high-impact developer segments in addition to status infrastructure.

## Common failure patterns
Speculation, conflicting channels, hidden timestamps, unsafe retry advice, declaring resolution before validation, and leaking internal/customer details.

## Verification
Cross-check every update with incident authority, validate workaround safety, and confirm recovery from external developer paths before declaring normal operation.

## Expected output
Clear incident updates that help developers recognize impact, act safely, and know when/where to expect updates.

## Stop conditions
Stop independent communication if incident command revokes approval, security/privacy facts are sensitive, or available evidence is not confirmed.