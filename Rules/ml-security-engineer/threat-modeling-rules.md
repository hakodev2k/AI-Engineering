# ML Threat Modeling Rules

## Purpose
Ensure machine-learning systems are designed against realistic security threats before implementation or release.

## Scope
Applies to training, evaluation, model storage, serving, retraining, and external model integrations.

## MUST
- Define protected assets, trust boundaries, attacker goals, entry points, and abuse cases for every production ML system.
- Cover threats to data, code, model artifacts, identities, infrastructure, and inference interfaces.
- Revisit the threat model when architecture, data sources, model sources, or exposure changes.
- Record mitigations, residual risks, owners, and required approvals for material risks.

## MUST NOT
- Treat a generic application-security checklist as a complete ML threat model.
- Assume internal datasets, model files, or pipelines are trustworthy without evidence.

## SHOULD
- Prioritize threats by plausible impact and exploitability rather than novelty.
- Include poisoning, extraction, inversion, evasion, supply-chain compromise, and unauthorized model replacement where relevant.

## Exceptions
Any omitted threat class requires documented rationale, supporting evidence, and reviewer approval.

## Verification
Review architecture diagrams, data flows, threat records, mitigation tests, and unresolved-risk approvals during security review.