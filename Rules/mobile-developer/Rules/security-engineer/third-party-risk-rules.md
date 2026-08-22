# Third-Party Security Risk Rules

## Purpose
Control security risk introduced by vendors, SaaS providers, external processors, and service dependencies.

## Scope
Applies to third parties that access systems, process sensitive data, provide critical services, or participate in security-sensitive workflows.

## MUST
- Third parties MUST be assessed according to the sensitivity and criticality of the access or service they provide.
- Security requirements MUST be defined before granting material access to sensitive systems or data.
- High-risk findings MUST have remediation, compensating controls, or explicit risk acceptance before onboarding or renewal.
- Third-party access MUST follow least privilege and be removed when no longer needed.
- Material security incidents at critical providers MUST trigger impact assessment.

## MUST NOT
- MUST NOT treat contractual language alone as evidence that technical controls are effective.
- MUST NOT grant persistent privileged access solely for vendor convenience.
- MUST NOT ignore concentration or dependency risk for critical providers.

## SHOULD
- Reassess critical providers periodically and after material service changes.
- Prefer providers with transparent security practices and useful assurance evidence.

## Exceptions
Exceptions require documented business need, risk owner, compensating controls, approval, and reassessment date.

## Verification
Use vendor assessments, assurance reports, access reviews, architecture review, contract controls, incident evidence, and periodic reassessment.