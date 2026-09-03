# Data Source Discovery and Acquisition

## Purpose
Identify and acquire data sources that add useful signal while controlling legal, privacy, cost, quality, and operational risk.

## When to use
Use when a dataset lacks domain coverage, freshness, languages, modalities, rare cases, or representative production behavior.

## Inputs
Target dataset specification, known sources, access constraints, budget, licensing requirements, and existing coverage metrics.

## Context to inspect
Review current source inventory, duplicates, provenance records, terms of use, data contracts, collection mechanisms, geographic restrictions, and downstream parsers.

## Core knowledge
Source value depends on marginal information, not raw volume. Public availability does not imply unrestricted training rights. Acquisition pipelines need reproducibility, rate controls, provenance, immutable snapshots, and change detection.

## Procedure
1. Convert coverage gaps into source-search criteria.
2. Inventory internal, licensed, public, partner, and generated sources.
3. Assess relevance, uniqueness, freshness, expected noise, and scale.
4. Review licensing, consent, privacy, and contractual constraints.
5. Estimate acquisition and processing cost.
6. Pilot a bounded sample and profile quality.
7. Define collection method, rate limits, retries, checksums, and provenance metadata.
8. Capture source version and acquisition timestamp.
9. Quarantine unexpected formats or policy violations.
10. Measure marginal coverage after ingestion before scaling.

## Decision points
Prefer licensed or first-party data when provenance and stability matter. Prefer APIs over scraping when they provide durable contracts. Reject high-volume sources whose marginal value is low or whose rights are unclear.

## Common failure patterns
- Equating accessibility with permission
- Collecting before defining coverage gaps
- Losing source lineage
- Ignoring source drift or format changes
- Overweighting one convenient source
- Retrying acquisition indefinitely

## Verification
Implemented means the source can be reproducibly acquired and traced. Verified means sampled content satisfies quality and policy thresholds and measurably improves required coverage without unacceptable duplication.

## Expected output
An approved source record with acquisition method, provenance, rights assessment, quality profile, expected contribution, and operational controls.

## Stop conditions
Stop when rights are ambiguous, access would violate policy or terms, source identity cannot be established, or collection requires privileges not granted.