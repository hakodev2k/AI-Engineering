# Privacy Threat Modeling Rules

## Purpose
Identify privacy harms and abuse paths before they become production incidents.

## Scope
Applies to new systems and material changes involving identity, sensitive data, profiling, tracking, sharing, inference, or large-scale processing.

## MUST
- Threat models MUST identify data subjects, sensitive assets, trust boundaries, adversaries, misuse cases, and likely privacy harms.
- Models MUST consider unauthorized disclosure, excessive collection, inference, linkage, re-identification, surveillance, and abusive privileged access where relevant.
- Material threats MUST map to controls, owners, and verification evidence.
- Residual high-risk threats MUST be explicitly accepted or remediated before production release.

## MUST NOT
- Threat modeling MUST NOT be limited to confidentiality if other privacy harms remain possible.
- Controls MUST NOT be marked complete solely because they are planned.
- Historical absence of incidents MUST NOT be treated as evidence that a threat is impossible.

## SHOULD
- Threat models SHOULD be updated when data flows, user populations, adversary capabilities, or external sharing materially change.
- Abuse scenarios SHOULD include insider and compromised-service perspectives.

## Exceptions
Exceptions require documented scope, residual risk, compensating controls, and accountable approval.

## Verification
Review threat-model artifacts, control mappings, test evidence, architecture changes, and unresolved risks. Confirm high-risk findings have explicit disposition.