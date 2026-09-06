# Privacy and Data Governance Rules

## Purpose
Protect sensitive information throughout retrieval ingestion, indexing, evaluation, and serving.

## Scope
PII, confidential data, retention, deletion, residency, provider transfer, and audit requirements.

## MUST
- Sensitive corpora MUST be classified before production indexing.
- Retention and deletion requirements MUST propagate to derived chunks, vectors, caches, and evaluation artifacts.
- External providers MUST receive only data permitted by approved handling policy.
- Logs and traces MUST minimize sensitive retrieved content.
- Data residency requirements MUST be reflected in storage and processing architecture.

## MUST NOT
- MUST NOT assume embeddings are anonymous merely because original text is transformed.
- MUST NOT copy production-sensitive corpora into lower-control environments without approval.
- MUST NOT retain deleted records in hidden indexes without a governed exception.

## SHOULD
- Minimize indexed sensitive attributes when they do not improve the use case.
- Automate deletion propagation and retention checks.

## Exceptions
Exceptions require privacy/security review, purpose, safeguards, duration, and approval.

## Verification
Inspect classification metadata, retention policy, deletion tests, provider configuration, data-flow diagrams, and log samples.