# Context Deduplication Rules

## Purpose
Prevent repeated evidence from consuming tokens, biasing attention, or overstating confidence.

## Scope
Exact duplicates, near-duplicates, mirrored sources, repeated instructions, and redundant summaries.

## MUST
- Context assembly MUST detect exact duplicate items before model invocation.
- Near-duplicate evidence MUST be consolidated when repetition adds no distinct information.
- Deduplication MUST preserve the strongest available provenance and source location.
- Repetition intentionally retained for emphasis MUST be explicit and bounded.
- Deduplication behavior MUST be deterministic for equivalent inputs.

## MUST NOT
- MUST NOT count mirrored copies as independent corroboration.
- MUST NOT remove distinct evidence solely because wording is similar.
- MUST NOT discard higher-authority provenance when consolidating duplicate content.

## SHOULD
- Use semantic similarity only with thresholds validated against representative data.
- Track duplicate-rate metrics for retrieval pipelines.

## Exceptions
Intentional redundancy requires a documented reason and measured benefit.

## Verification
Inspect duplicate fixtures, merged provenance, token usage, and retrieval traces.