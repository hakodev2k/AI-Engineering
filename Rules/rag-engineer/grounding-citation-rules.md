# Grounding and Citation Rules

## Purpose
Ensure generated answers remain attributable to retrieved evidence.

## Scope
Evidence selection, citation mapping, unsupported claims, source conflicts, and provenance display.

## MUST
- Material factual claims based on retrieval MUST be traceable to supporting source passages.
- Citation mapping MUST preserve the relationship between generated claims and source identifiers.
- Conflicting retrieved evidence MUST be surfaced or resolved using explicit evidence rules.
- Unsupported claims MUST be distinguishable from grounded claims when the product allows analysis beyond sources.
- Source removal or replacement MUST invalidate stale citation mappings.

## MUST NOT
- MUST NOT attach a citation to a source that does not support the associated claim.
- MUST NOT fabricate source identifiers or provenance.
- MUST NOT present retrieval confidence as factual certainty.

## SHOULD
- Prefer primary or authoritative sources when available.
- Preserve enough source context for human review.

## Exceptions
Citation-free experiences require documented rationale and alternate grounding verification.

## Verification
Run claim-to-source checks, citation integrity tests, conflict cases, and sampled human review.