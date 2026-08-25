# Data Privacy and Governance Rules

## Purpose
Control sensitive data propagation, retention, discovery, and deletion obligations in event streams.

## Scope
Applies to classification, PII, regulated data, lineage, retention, masking, and deletion workflows.

## MUST
- Event fields MUST be classified according to applicable project data-governance requirements before production publication.
- Producers MUST minimize sensitive fields to those required by documented consumers.
- Retention and archival MUST comply with data classification and legal/business obligations.
- Lineage MUST identify authoritative producers and material downstream uses for governed streams.
- Deletion or subject-right workflows MUST account for immutable logs, compacted streams, archives, derived state, and downstream copies.

## MUST NOT
- MUST NOT place secrets, raw credentials, or authentication tokens in events.
- MUST NOT replicate sensitive data broadly for consumer convenience.
- MUST NOT promise deletion from append-only infrastructure without a technically validated mechanism and scope statement.
- MUST NOT log sensitive payloads during debugging by default.

## SHOULD
- Tokenization, pseudonymization, or reference identifiers SHOULD be preferred when consumers do not require raw sensitive values.
- Governance metadata SHOULD be discoverable with stream contracts.

## Exceptions
Additional sensitive data requires purpose, minimization analysis, retention, access controls, owner approval, and verification.

## Verification
Use schema review, data-classification checks, ACL inspection, retention configuration, lineage review, log scans, and deletion exercises.