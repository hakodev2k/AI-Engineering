# Governance and Compliance

## Purpose
Ensure database architecture supports accountable data governance and applicable compliance obligations.

## Scope
Data classification, lineage, auditability, residency, access governance, and compliance-sensitive design.

## MUST
- Sensitive data MUST be classified and mapped to required handling controls.
- Database architecture MUST identify residency, encryption, audit, retention, and access requirements where applicable.
- Material control changes MUST preserve evidence sufficient for audit and review.
- Data lineage for regulated or decision-critical data MUST be traceable across authoritative transformations.

## MUST NOT
- MUST NOT infer compliance from vendor certification alone.
- MUST NOT move regulated data across regions or trust boundaries without approved requirements analysis.
- MUST NOT remove audit evidence required by policy or law.

## SHOULD
- Governance controls SHOULD be automated where deterministic enforcement is possible.
- Architecture reviews SHOULD include compliance stakeholders for materially regulated workloads.

## Exceptions
Exceptions require documented obligation, risk, compensating control, duration, and accountable approval.

## Verification
Review classification records, lineage, residency configuration, audit logs, retention settings, encryption controls, and compliance evidence.