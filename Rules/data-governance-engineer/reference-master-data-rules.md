# Reference and Master Data Rules
## Purpose
Protect consistency of shared identifiers, code sets, and mastered entities.
## Scope
Reference data, master entities, hierarchies, crosswalks, and golden records.
## MUST
- Authoritative sources and stewardship responsibilities MUST be defined for shared master and reference data.
- Identifier, merge, survivorship, and hierarchy rules MUST be explicit and version-controlled.
- Material changes MUST assess downstream compatibility and reconciliation impact.
## MUST NOT
- Competing golden records MUST NOT be introduced without an explicit domain boundary or reconciliation model.
- Code values MUST NOT be reused with changed meaning without compatibility controls.
## SHOULD
- Consumers SHOULD reference governed shared data rather than maintain uncontrolled copies.
## Exceptions
Local copies require synchronization, ownership, divergence controls, and documented rationale.
## Verification
Review authoritative-source mappings, duplicate metrics, change history, reconciliation reports, and consumer dependencies.