# Context Compression Rules

## Purpose
Reduce context size without removing facts, constraints, or distinctions required for correct model behavior.

## Scope
Summarization, extraction, compaction, canonicalization, and hierarchical context.

## MUST
- Compression MUST preserve mandatory instructions, decision-critical facts, uncertainty, provenance, and unresolved conflicts.
- Generated summaries MUST remain attributable to their source material.
- Compression quality MUST be evaluated against representative downstream tasks.
- Lossy transformations MUST identify what categories of information may be omitted.

## MUST NOT
- MUST NOT convert uncertainty into certainty during summarization.
- MUST NOT merge conflicting claims into a single unsupported conclusion.
- MUST NOT remove qualifiers that materially change meaning.

## SHOULD
- Prefer extractive compression for highly precise constraints.
- Use hierarchical summaries only when source links remain available.

## Exceptions
Exceptions require documented information-loss tolerance and validation.

## Verification
Compare source and compressed snapshots, run task evaluations, and inspect provenance mappings.