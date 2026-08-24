# Incident Intelligence Support

## Purpose
Provide time-sensitive intelligence during incidents without disrupting evidence handling or incident-command responsibilities.

## When to use
Use when responders need context on adversary behavior, infrastructure, malware, scope indicators, likely next actions, or related campaigns.

## Inputs
Incident timeline, observables, affected assets, logs, forensic findings, current containment state, intelligence sources.

## Context to inspect
Understand incident commander, evidence rules, hypotheses under investigation, time sensitivity, and what questions responders actually need answered.

## Core knowledge
During incidents, intelligence must be fast, bounded, and clearly distinguished from forensic fact. Preserve chain of custody and avoid contaminating evidence.

## Procedure
1. Align with incident command and define intelligence questions.
2. Ingest only approved incident artifacts.
3. Rapidly validate and enrich observables.
4. Search for related campaigns, TTPs, and infrastructure.
5. Provide likely next behaviors with confidence and caveats.
6. Suggest scope-expansion indicators and hunts.
7. Track intelligence changes as evidence develops.
8. Record sources and timestamps.
9. After containment, consolidate lessons into durable intelligence.

## Decision points
Favor speed for reversible low-risk guidance; require stronger validation for attribution, public statements, or disruptive containment.

## Common failure patterns
Parallel investigations without coordination, treating external reports as incident facts, overloading responders, and changing evidence.

## Verification
Incident command confirms intelligence answered active questions and evidence provenance remains intact.

## Expected output
Time-stamped intelligence updates, enrichment, related activity, confidence, and responder-focused recommendations.

## Stop conditions
Stop independent action when it could affect evidence, containment, legal obligations, or incident-command authority.