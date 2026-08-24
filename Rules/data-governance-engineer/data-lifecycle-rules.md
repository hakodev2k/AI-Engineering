# Data Lifecycle Rules
## Purpose
Govern data from creation through use, archival, and disposal.
## Scope
Data assets and products across development, test, production, archive, and retirement states.
## MUST
- Material assets MUST have lifecycle states with entry, transition, and retirement criteria.
- Lifecycle transitions MUST preserve ownership, classification, lineage, retention, and consumer obligations.
- Deprecated assets MUST identify replacement guidance and retirement dates when consumers remain.
## MUST NOT
- Abandoned or superseded assets MUST NOT remain certified indefinitely.
- Production data MUST NOT be copied into lower environments without approved protection controls.
## SHOULD
- Lifecycle state SHOULD be machine-readable and drive access, certification, and retention automation.
## Exceptions
Extended legacy operation requires risk, owner, dependency evidence, target date, and approval.
## Verification
Review lifecycle metadata, deprecation notices, consumer inventories, environment controls, and retirement evidence.