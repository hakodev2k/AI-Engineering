# Document Normalization Rules

## Purpose
Normalize heterogeneous knowledge sources without destroying information required for retrieval, security, or evidence.

## Scope
Applies to parsing, text extraction, markup cleanup, metadata normalization, table handling, code extraction, and structural conversion.

## MUST
- Normalization MUST preserve source identity, document hierarchy, section boundaries, and metadata needed for retrieval or citations.
- Transformations MUST be deterministic for the same source and parser version where practical.
- Parser or extractor versions MUST be traceable to processed artifacts.
- Tables, lists, code blocks, headings, and other semantic structures MUST be preserved when they affect meaning.
- Unsupported or low-confidence extraction MUST be surfaced as a quality condition.
- Character encoding and normalization MUST avoid silent corruption of identifiers, formulas, code, or non-English text.

## MUST NOT
- Normalization MUST NOT merge unrelated sections solely to simplify chunking.
- Boilerplate removal MUST NOT delete contractual, security, or compliance-relevant text without evidence.
- Extracted text MUST NOT be presented as complete when the parser skipped unsupported embedded content.

## SHOULD
- Normalized output SHOULD include offsets or structural references back to the source.
- Parsing SHOULD separate content quality signals from retrieval relevance signals.
- Format-specific extractors SHOULD be tested against representative edge cases.

## Exceptions
Exceptions require documented parser limitations, affected content classes, risk, fallback behavior, and validation evidence.

## Verification
Use golden-document tests, parser regression suites, structural diffs, multilingual samples, table/code preservation tests, and manual review of representative difficult documents.