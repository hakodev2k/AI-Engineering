# Context Assembly Rules

## Purpose
Build compact, relevant, attributable context from retrieved evidence.

## Scope
Candidate selection, ordering, deduplication, size budgets, source grouping, and formatting.

## MUST
- Context assembly MUST enforce a defined size budget.
- Each included passage MUST retain source identity and retrieval provenance.
- Duplicate passages MUST be controlled so independent evidence is not displaced.
- Ordering strategy MUST be documented and evaluated for answer quality.
- Retrieved source text MUST remain distinguishable from application instructions.

## MUST NOT
- MUST NOT include content excluded by access controls.
- MUST NOT truncate passages in ways that materially alter their meaning.
- MUST NOT allow retrieved text to redefine application control instructions.

## SHOULD
- Prefer evidence diversity when independent sources are useful.
- Preserve sufficient budget for answer generation.

## Exceptions
Large-context strategies require measured benefit and latency/cost analysis.

## Verification
Inspect assembled contexts, budgets, provenance, duplication metrics, and end-to-end evaluations.