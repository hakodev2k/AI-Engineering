# Document Parsing and Structure Preservation

## Purpose
Extract useful text while retaining structural signals needed for accurate retrieval and citation.

## When to use
Use for PDFs, HTML, office documents, manuals, tickets, tables, or other semi-structured corpora.

## Inputs
Representative documents, parser options, expected layouts, downstream chunk schema, citation requirements.

## Context to inspect
Inspect headings, tables, lists, page boundaries, captions, footnotes, code blocks, reading order, hidden text, and scanned-document prevalence.

## Core knowledge
Flattening documents destroys relationships that retrieval and citation may require. Parsing quality should be evaluated on semantic structure, not merely extracted character count.

## Procedure
1. Define structures that downstream retrieval must preserve.
2. Build a representative parsing test set.
3. Parse with layout/semantic metadata where available.
4. Normalize whitespace conservatively.
5. Preserve heading hierarchy, page anchors, table boundaries, and code fences.
6. Detect extraction anomalies and empty regions.
7. Route exceptional formats to specialized parsers only when justified.
8. Store parser version and source coordinates.
9. Compare output against originals manually and automatically.
10. Add regression fixtures for observed parser failures.

## Decision points
Use layout-aware parsing when spatial structure affects meaning. Avoid OCR unless source text is unavailable and accuracy has been validated for the corpus.

## Common failure patterns
Broken reading order; table cells detached from headers; lost page anchors; headers repeated into every chunk; invisible text contamination.

## Verification
Inspect sampled outputs side-by-side with originals and test citations, tables, headings, and known difficult layouts.

## Expected output
Structured, provenance-preserving document records suitable for chunking and citation.

## Stop conditions
Stop when parsing materially changes meaning and no validated extraction method is available.