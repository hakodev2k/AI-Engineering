# Privacy Threat Modeling Rules

## Purpose
Identify privacy harms that conventional security threat modeling may miss.

## Scope
New systems, material feature changes, sensitive-data processing, identity linkage, inference, sharing, and high-scale analytics.

## MUST
- Threat models MUST consider unauthorized disclosure, over-collection, linkability, re-identification, inference, surveillance, misuse, and loss of user control.
- Trust boundaries, actors, data flows, and likely abuse cases MUST be documented.
- High-impact privacy threats MUST have mitigations, owners, and verification evidence before release.
- Residual risk MUST be explicitly accepted by the appropriate human authority.

## MUST NOT
- MUST NOT equate security confidentiality with complete privacy protection.
- MUST NOT dismiss low-probability threats when potential harm is severe or systemic.

## SHOULD
- Revisit threat models when data sources, model capabilities, sharing, identity resolution, or scale changes.

## Exceptions
Exceptions require bounded scope, rationale, compensating controls, owner, and approval.

## Verification
Review threat models, architecture changes, abuse tests, mitigations, residual-risk records, and release evidence.