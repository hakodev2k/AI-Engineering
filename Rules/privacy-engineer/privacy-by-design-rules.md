# Privacy by Design Rules

## Purpose
Embed privacy controls into system design before implementation or release.

## Scope
Architectures, features, data flows, integrations, analytics, and AI-enabled processing involving personal data.

## MUST
- Privacy requirements MUST be identified during design, not after implementation.
- Designs MUST document personal-data categories, purposes, actors, stores, transfers, retention, and deletion paths.
- Privacy risks MUST be evaluated before materially changing data collection, use, sharing, or inference.
- High-risk changes MUST include explicit mitigations and accountable owners.
- Privacy controls MUST be testable or supported by reviewable evidence.

## MUST NOT
- MUST NOT defer known privacy risks solely to accelerate delivery.
- MUST NOT treat encryption alone as sufficient privacy protection.
- MUST NOT introduce new personal-data uses without confirming purpose compatibility or required approval.

## SHOULD
- Prefer data minimization, local processing, aggregation, pseudonymization, and privacy-preserving defaults.
- Prefer architectures that make deletion, restriction, and access requests operationally feasible.

## Exceptions
Exceptions require documented rationale, legal or policy basis where applicable, risk analysis, compensating controls, owner, expiry, and approval.

## Verification
Review design records, data-flow diagrams, threat/privacy assessments, test evidence, configuration, and release approvals.