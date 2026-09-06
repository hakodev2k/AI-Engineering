# Provenance and Citation Rules

## Purpose
Keep contextual claims traceable to the evidence that produced them.

## Scope
Source identity, source location, transformations, summaries, citations, and audit metadata.

## MUST
- Every retrieved context item MUST retain source identity and a stable location or equivalent reference when available.
- Derived summaries MUST retain links to their underlying evidence.
- Context transformations MUST preserve provenance through each transformation stage.
- Claims requiring verification MUST be traceable to supporting context.
- Provenance metadata MUST distinguish original content from generated summaries or annotations.

## MUST NOT
- MUST NOT attribute generated text directly to a source that did not contain it.
- MUST NOT strip provenance merely to reduce token usage when it is required for verification.
- MUST NOT merge conflicting sources without retaining their separate identities.

## SHOULD
- Provenance SHOULD be represented compactly and machine-readably.
- Citation identifiers SHOULD remain stable within a request.

## Exceptions
Exceptions require an alternative audit mechanism and documented rationale.

## Verification
Inspect context traces, citation mapping tests, transformed evidence, and final claim-source alignment.