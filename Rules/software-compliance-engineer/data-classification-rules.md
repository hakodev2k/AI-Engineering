# Data Classification Rules

## Purpose
Ensure software compliance controls reflect the sensitivity, ownership, and regulatory characteristics of handled data.

## Scope
Applies to application data, metadata, logs, backups, exports, test data, and derived datasets.

## MUST
- Data classes MUST be defined with handling requirements that engineering teams can apply consistently.
- Systems MUST identify which data classes they store, process, transmit, or derive.
- Control strength MUST reflect the highest applicable classification and legal or contractual obligation.
- Reclassification or new data use MUST trigger impact review.

## MUST NOT
- MUST NOT treat unknown or unclassified sensitive data as unrestricted by default.
- MUST NOT copy production-sensitive data into lower-control environments without an approved handling basis.

## SHOULD
- Enforce classification metadata and handling checks automatically where practical.

## Exceptions
Exceptions require documented data scope, necessity, safeguards, retention, owner, and approval.

## Verification
Inspect data inventories, schemas, flow diagrams, storage policies, access controls, and environment configurations.