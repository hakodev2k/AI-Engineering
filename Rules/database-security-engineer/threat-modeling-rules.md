# Database Threat Modeling Rules

## Purpose
Identify database trust boundaries and likely abuse paths before controls are selected or changed.

## Scope
Applies to new databases, material architecture changes, sensitive data introduction, new integrations, and major trust-boundary changes.

## MUST
- Threat analysis MUST identify valuable data, actors, trust boundaries, entry points, privileged operations, and credible abuse scenarios.
- Controls MUST map to specific threats or stated security requirements rather than generic best-practice claims alone.
- Material architecture changes MUST reassess lateral movement, privilege escalation, exfiltration, integrity loss, and recovery risk.
- Assumptions that materially reduce perceived risk MUST be explicit and verifiable.
- Unmitigated high-impact threats MUST have accountable risk decisions.

## MUST NOT
- Network isolation, encryption, or authentication alone MUST NOT be represented as a complete database threat model.
- Agent confidence or undocumented assumptions MUST NOT substitute for evidence.
- Threat modeling MUST NOT ignore administrators, compromised workloads, or supply-chain dependencies when credible.

## SHOULD
- Reuse proven threat patterns while adapting them to actual topology and data flows.
- Prioritize mitigations by realistic attack path and business impact.

## Exceptions
Reduced analysis requires documented low-risk scope and reviewer agreement.

## Verification
Review diagrams, data flows, identity/privilege maps, assumptions, threat-to-control traceability, open risks, and evidence that architecture changes triggered reassessment.