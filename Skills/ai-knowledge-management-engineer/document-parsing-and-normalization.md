# Document Parsing and Normalization

## Purpose
Transform heterogeneous source content into a stable canonical representation that preserves meaning, structure, provenance, and machine-readable boundaries for downstream AI retrieval.

## When to use
Use when ingesting PDFs, HTML, office documents, markdown, tickets, emails, or mixed structured/unstructured content.

## Inputs
Raw source objects, parsers, source metadata, document types, encoding rules, extraction requirements, and downstream indexing schema.

## Context to inspect
Inspect source samples, parser outputs, tables, headings, lists, links, images, code blocks, page boundaries, OCR artifacts, and unsupported formats.

## Core knowledge
Normalization should remove transport noise without destroying semantic structure. Layout carries meaning: headings, table rows, code blocks, captions, and list relationships often matter to retrieval and citation.

## Procedure
1. Classify content types and choose parsers by format.
2. Preserve stable source identity and original locations.
3. Extract text plus structural elements such as headings, sections, tables, lists, links, and code.
4. Normalize encoding, whitespace, boilerplate, and repeated headers conservatively.
5. Represent tables and structured fields in a retrieval-friendly form without flattening critical relationships.
6. Mark extraction confidence and parser warnings.
7. Preserve page, section, anchor, and source offsets for citations.
8. Detect empty, corrupted, encrypted, or low-quality outputs.
9. Store the raw-to-normalized lineage.
10. Validate representative documents and edge cases before broad rollout.

## Decision points
Prefer native text extraction over OCR when available. Keep layout-aware structure when user questions depend on tables or sections. Avoid aggressive cleanup when it risks changing meaning.

## Common failure patterns
Dropping table headers, merging unrelated columns, stripping code indentation, losing page references, repeated boilerplate dominating chunks, and silently accepting empty parser output.

## Verification
Compare normalized output against source samples, test structural queries, verify citation offsets, and track extraction failure rates by format.

## Expected output
Canonical normalized documents with structural metadata, provenance, parser diagnostics, and reliable downstream boundaries.

## Stop conditions
Stop when extraction quality is too low for trustworthy retrieval, documents are encrypted without authorization, or parser behavior materially changes regulated content.