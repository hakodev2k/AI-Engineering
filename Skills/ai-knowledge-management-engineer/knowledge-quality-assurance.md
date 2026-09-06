# Knowledge Quality Assurance

## Purpose
Define and enforce quality controls for AI-consumable knowledge so completeness, correctness, structure, authority, and freshness are measured rather than assumed.

## When to use
Use when onboarding sources, auditing retrieval failures, preparing a production launch, or establishing quality gates for a growing corpus.

## Inputs
Corpus samples, source authority, metadata schema, parser outputs, freshness SLAs, retrieval requirements, and known defects.

## Context to inspect
Inspect missing metadata, empty extractions, malformed tables, duplicate content, stale versions, orphaned chunks, broken links, and low-confidence transformations.

## Core knowledge
Knowledge quality is multidimensional: correctness, completeness, consistency, timeliness, provenance, accessibility, and structural integrity affect downstream AI differently. Quality gates should distinguish hard failures from warnings.

## Procedure
1. Define measurable quality dimensions for each source class.
2. Establish hard gates for unusable or unsafe content.
3. Measure completeness of required metadata and provenance.
4. Detect empty, truncated, duplicated, malformed, or orphaned records.
5. Check freshness and version consistency.
6. Sample transformed content against originals.
7. Validate links, anchors, tables, and citations where relevant.
8. Track defects by source, parser, connector, and content type.
9. Route defects to accountable owners with severity and remediation evidence.
10. Re-run checks after fixes and maintain trend dashboards.

## Decision points
Block indexing for defects that make content unsafe or misleading; allow warnings for non-critical enrichment gaps. Tune gates by source risk rather than one global threshold.

## Common failure patterns
Using ingestion success as quality proof, sampling only clean documents, hiding systematic parser defects in averages, and lacking ownership for failed content.

## Verification
Run automated checks plus representative manual audits. Confirm blocked content cannot enter production and remediation closes the measured defect.

## Expected output
A quality framework with rules, severity levels, automated checks, ownership, and trend metrics.

## Stop conditions
Stop when quality criteria cannot be tied to user or operational risk, or critical source defects lack an accountable remediation owner.