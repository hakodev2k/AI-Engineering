# Collection Planning

## Purpose
Design lawful, efficient collection that answers prioritized intelligence requirements without drowning analysts in noise.

## When to use
Use after requirements are defined or when source coverage is inadequate.

## Inputs
PIRs, source inventory, access constraints, budgets, retention/privacy rules, collection telemetry.

## Context to inspect
Review current feeds, internal logs, vendor sources, open sources, source latency, reliability, duplication, and licensing.

## Core knowledge
Collection should optimize relevance, timeliness, provenance, coverage, and cost. Separate raw collection from validated intelligence.

## Procedure
1. Decompose each PIR into observable information needs.
2. Map each need to candidate internal, commercial, community, and open sources.
3. Score sources for relevance, reliability, timeliness, legality, uniqueness, and cost.
4. Define query terms, entities, selectors, and refresh intervals.
5. Establish provenance and retention metadata.
6. Deduplicate overlapping feeds.
7. Pilot collection and measure signal-to-noise.
8. Tune or retire weak sources.
9. Document gaps and alternatives.

## Decision points
Buy when unique coverage and support justify cost; build when internal context or custom logic is differentiating. Increase cadence only when the threat changes quickly enough to justify it.

## Common failure patterns
Feed accumulation, unknown provenance, uncontrolled PII, duplicate indicators, no expiry, and collecting data that cannot answer a PIR.

## Verification
Verify sample records trace to sources, PIR coverage is measurable, duplicates are controlled, and analysts can explain why each source exists.

## Expected output
Collection plan with source-to-PIR mapping, cadence, ownership, provenance, controls, costs, and gaps.

## Stop conditions
Stop when source acquisition is unauthorized, licensing is unclear, or legal/privacy review is required.