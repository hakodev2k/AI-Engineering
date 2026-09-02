# Security and Privacy Boundary Rules

## Purpose
Ensure sustainability optimization never bypasses security, privacy, confidentiality, or regulatory boundaries.

## Scope
Applies to telemetry, data placement, retention, caching, resource consolidation, logging, model or analytics workloads, and infrastructure optimization.

## MUST
- Sustainability designs MUST preserve required authentication, authorization, encryption, isolation, auditability, privacy, and data-residency controls.
- Sustainability telemetry containing sensitive or linkable information MUST follow the same classification, access, retention, and minimization requirements as other operational data.
- Consolidation decisions MUST evaluate whether combining workloads changes trust boundaries, blast radius, or least-privilege assumptions.
- Security claims about an optimized design MUST be supported by configuration inspection, testing, review, or equivalent evidence.

## MUST NOT
- MUST NOT disable encryption, security monitoring, vulnerability scanning, access controls, or privacy protections merely to reduce compute, storage, or transfer use.
- MUST NOT move sensitive data to a lower-impact location that violates residency, contractual, or access requirements.
- MUST NOT expose secrets, credentials, authentication tokens, personal data, or confidential payloads in sustainability dashboards or reports.

## SHOULD
- Apply data minimization to sustainability telemetry itself.
- Prefer security-preserving efficiency improvements such as reducing redundant work, improving locality within approved boundaries, and retiring unused privileged resources.

## Exceptions
Exceptions affecting an established security or privacy control require documented risk, compensating controls, evidence, security/privacy owner approval, expiry or review date, and a restoration plan.

## Verification
Review data classifications, IAM policy, encryption configuration, telemetry schemas, residency controls, security test results, audit logs, architecture reviews, and approved exceptions.
