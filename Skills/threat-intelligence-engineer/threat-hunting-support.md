# Threat Hunting Support

## Purpose
Convert intelligence hypotheses into testable hunts using available telemetry and feed results back into intelligence and detection engineering.

## When to use
Use when intelligence indicates plausible adversary behavior not adequately covered by existing detections.

## Inputs
PIRs, TTPs, campaign intelligence, telemetry inventory, detection coverage, baselines, historical retention.

## Context to inspect
Review data sources, field semantics, retention, known-good behavior, endpoint/network/cloud coverage, and previous hunts.

## Core knowledge
A hunt is hypothesis-driven and bounded. Absence of evidence is meaningful only when telemetry coverage and query validity are known.

## Procedure
1. State a falsifiable adversary hypothesis.
2. Identify required observables and telemetry.
3. Confirm data coverage and retention.
4. Translate behavior into platform-appropriate queries.
5. Test queries on known-good and, when available, representative malicious data.
6. Execute in bounded time/entity scope.
7. Triage anomalies with contextual enrichment.
8. Document positive and negative findings.
9. Promote repeatable findings to detections.
10. Update intelligence gaps and confidence.

## Decision points
Use IOC hunts for immediate scope expansion; use behavioral hunts for durable coverage. Widen scope only after validating query quality.

## Common failure patterns
Searching without a hypothesis, treating query hits as incidents, ignoring telemetry gaps, unbounded hunts, and failing to operationalize lessons.

## Verification
Queries are reproducible, coverage is documented, findings are dispositioned, and durable detection opportunities are handed off.

## Expected output
Hunt package with hypothesis, queries, scope, findings, limitations, and follow-up actions.

## Stop conditions
Stop when telemetry cannot test the hypothesis, query cost threatens production systems, or investigation requires incident-response authority.