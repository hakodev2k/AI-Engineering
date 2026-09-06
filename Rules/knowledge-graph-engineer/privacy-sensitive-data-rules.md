# Privacy and Sensitive Data Rules

## Purpose
Protect personal, confidential, regulated, and high-risk information represented in graph form.

## Scope
Sensitive nodes, relationships, inferred attributes, lineage, exports, logs, retention, and derived knowledge.

## MUST
- Sensitive graph elements MUST be classified and handled according to applicable policy and legal requirements.
- Derived relationships MUST be assessed for whether they reveal sensitive information not explicit in source records.
- Retention MUST align with documented business and regulatory requirements.
- Logs and traces MUST avoid exposing raw sensitive graph values unless specifically authorized.
- Deletion requirements MUST account for derived facts and indexes when applicable.

## MUST NOT
- MUST NOT treat pseudonymized identifiers as anonymous without evidence.
- MUST NOT expose sensitive neighborhoods or paths through indirect traversal.
- MUST NOT copy production-sensitive graph data into lower-control environments for convenience.

## SHOULD
- Minimize stored sensitive attributes and unnecessary relationship detail.
- Maintain lineage sufficient for governed deletion workflows.

## Exceptions
Exceptions require privacy/security review, safeguards, rationale, and approval.

## Verification
Review classifications, query controls, deletion tests, retention settings, and log redaction.