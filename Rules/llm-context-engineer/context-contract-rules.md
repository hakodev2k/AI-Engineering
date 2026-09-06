# Context Contract Rules

## Purpose
Define stable, reviewable contracts for what information may enter an LLM context and how consumers interpret it.

## Scope
Context sources, field semantics, ordering, provenance, freshness, trust, and consumer expectations.

## MUST
- Every production context source MUST declare purpose, owner, provenance, trust level, freshness, and failure behavior.
- Context fields MUST have explicit semantics and MUST distinguish authoritative facts from derived or heuristic content.
- Consumer-visible changes MUST be classified as compatible or breaking before release.
- Context assembly MUST preserve enough metadata to audit why a source was included.

## MUST NOT
- Context meaning MUST NOT change silently while retaining the same identifier.
- Untrusted content MUST NOT be presented as authoritative system guidance.
- Missing provenance MUST NOT be hidden by generic labels.

## SHOULD
- Contracts SHOULD be machine-readable and validated in CI.
- Deprecated fields SHOULD have migration guidance and sunset dates.

## Exceptions
Exceptions require documented rationale, affected consumers, risk, and approval.

## Verification
Inspect schemas, context snapshots, contract tests, and consumer compatibility evidence.