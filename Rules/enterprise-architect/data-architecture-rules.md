# Enterprise Data Architecture Rules

## Purpose
Protect enterprise data ownership, meaning, integrity, discoverability, and lawful use.

## Scope
Data domains, systems of record, analytical data, reference data, lineage, sharing, and retention.

## MUST
- Critical data domains MUST have accountable ownership and authoritative sources.
- Cross-domain data contracts MUST define semantics, quality expectations, classification, and lifecycle responsibilities.
- Material data movement MUST preserve lineage, access controls, retention obligations, and reconciliation requirements.

## MUST NOT
- MUST NOT create uncontrolled copies of sensitive or authoritative data.
- MUST NOT resolve semantic conflicts by silently redefining shared business terms.

## SHOULD
- Data SHOULD be shared through governed contracts rather than direct coupling to internal storage models.

## Exceptions
Temporary replicas require purpose, owner, controls, retention period, and deletion or reconciliation plan.

## Verification
Inspect data catalog, lineage, ownership, contracts, classification, access reviews, and reconciliation evidence.