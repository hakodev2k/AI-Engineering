# Privacy and Sensitive Data Rules

## Purpose
Ensure trust-and-safety investigations and controls minimize privacy risk while preserving evidence needed to prevent serious harm.

## Scope
Applies to collection, access, retention, sharing, analysis, and deletion of safety-related personal or sensitive data.

## MUST
- Safety data collection MUST have a documented purpose tied to a specific abuse-prevention, investigation, legal, or remediation need.
- Systems MUST collect and retain only the data necessary for that purpose and applicable obligations.
- Sensitive evidence, identity signals, communications, and location data MUST use least-privilege access controls and auditable access paths.
- Retention periods MUST be defined by data class and safety purpose rather than indefinite convenience.
- Exports, screenshots, analyst notes, and derived datasets MUST inherit appropriate handling restrictions from source data.
- New safety capabilities using sensitive data MUST receive privacy review proportionate to the data sensitivity and user impact.

## MUST NOT
- MUST NOT copy sensitive evidence into unmanaged documents, tickets, chat channels, or local files when approved systems exist.
- MUST NOT use safety-collected data for unrelated product, advertising, or profiling purposes without an independently valid basis and approval.
- MUST NOT expose private content to reviewers who do not need it for the decision.
- MUST NOT retain raw sensitive data merely because deletion is operationally inconvenient.

## SHOULD
- Derived signals SHOULD minimize direct identifiers where equivalent safety performance is possible.
- Access SHOULD be time-bounded for incident-specific privileges.
- Investigative tooling SHOULD make data provenance and retention status visible.

## Exceptions
Emergency access MAY be granted to address imminent serious harm. The access MUST be authorized, logged, narrowly scoped, and reviewed afterward.

## Verification
Review data inventories, purpose documentation, access policies, audit logs, retention jobs, privacy assessments, and sampled investigative workflows. Confirm sensitive data does not leak into unmanaged operational systems.