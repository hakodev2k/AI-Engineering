# Release Risk Assessment Rules

## Purpose
Standardize how a Senior Release Manager identifies, evaluates, communicates, and controls release risk before production impact occurs.

## Scope
Applies to functional, operational, security, data, integration, customer, compliance, and organizational release risks.

## MUST
- Each release MUST receive a risk classification using defined criteria such as blast radius, reversibility, data impact, customer criticality, dependency count, novelty, and failure detectability.
- Material risks MUST identify likelihood, impact, affected assets or users, preventive controls, detection signals, containment options, and accountable owners.
- Risk assessment MUST be updated when scope, dependencies, deployment method, timing, or production conditions materially change.
- Residual high risk MUST be explicitly accepted by authorized humans before execution.
- Risk conclusions MUST be supported by test, operational, historical, architectural, security, or dependency evidence where available.

## MUST NOT
- Risk MUST NOT be downgraded merely to satisfy a release date.
- “Small code change” MUST NOT be treated as proof of low operational risk.
- Unknowns with plausible severe impact MUST NOT be silently recorded as low risk.

## SHOULD
- Similar historical incidents and previous release outcomes SHOULD inform assessment.
- Risk controls SHOULD favor prevention, bounded blast radius, rapid detection, and reversibility.

## Exceptions
Alternative assessment methods require documented rationale, equivalent risk coverage, evidence, and approval by the release governance owner.

## Verification
Review the risk register, scoring rationale, evidence links, mitigation owners, residual-risk approvals, and whether changed conditions triggered reassessment.