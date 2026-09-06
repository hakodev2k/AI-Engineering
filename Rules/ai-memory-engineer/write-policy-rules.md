# Memory Write Policy Rules

## Purpose
Prevent low-quality, unsafe, or unauthorized information from becoming persistent memory.

## Scope
Memory creation, updates, merges, write triggers, confidence thresholds, and authorization.

## MUST
- Persistent writes MUST have an explicit trigger and documented eligibility criteria.
- New memories MUST record source, timestamp, and producer identity where available.
- Conflicting memories MUST be reconciled by policy rather than last-write-wins by default.
- Safety-relevant or identity-sensitive memories MUST require stronger validation before persistence.

## MUST NOT
- MUST NOT persist arbitrary model output solely because it sounds plausible.
- MUST NOT promote transient conversation details into long-term memory without policy justification.
- MUST NOT overwrite higher-authority data with lower-authority inference.

## SHOULD
- Prefer conservative writes when evidence is weak.
- Use confidence, provenance, and recency together rather than a single signal.

## Exceptions
Exceptions require documented purpose, bounded scope, evidence, and approval for high-risk categories.

## Verification
Review write policies, audit logs, conflict tests, authorization tests, and sampled persisted memories.