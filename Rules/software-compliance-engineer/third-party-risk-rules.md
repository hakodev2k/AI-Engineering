# Third-Party Risk Rules

## Purpose
Ensure external services and suppliers do not introduce unmanaged compliance obligations or control gaps.

## Scope
Applies to SaaS, cloud services, processors, support vendors, embedded SDKs, subcontractors, and other external dependencies.

## MUST
- Third parties handling regulated functions or data MUST be assessed before production use.
- Assessments MUST cover applicable control responsibilities, data handling, incident obligations, and dependency criticality.
- Material supplier changes MUST trigger reassessment when they can alter compliance posture.
- Required contractual or assurance evidence MUST be retained and linked to the dependency.

## MUST NOT
- MUST NOT assume vendor certification automatically satisfies the consuming system's obligations.
- MUST NOT onboard critical third parties without defined ownership and exit considerations.

## SHOULD
- Tier review depth by data sensitivity, privilege, business criticality, and substitutability.

## Exceptions
Exceptions require documented urgency, residual risk, temporary safeguards, review date, and approval.

## Verification
Inspect vendor inventory, assessments, contracts or assurance records, architecture mappings, and reassessment history.