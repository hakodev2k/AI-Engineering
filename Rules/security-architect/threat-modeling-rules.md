# Threat Modeling Rules

## Purpose
Require systematic identification of plausible threats and architecture-level mitigations before material security risk is accepted.

## Scope
Applies to system boundaries, trust zones, data flows, privileged operations, integrations, exposed interfaces, and major architectural changes.

## MUST
- Threat models MUST identify assets, actors, trust boundaries, entry points, privileged paths, and abuse cases relevant to the system.
- Threats MUST be prioritized using documented impact and likelihood or equivalent risk criteria.
- Material threats MUST map to mitigations, detection, recovery controls, or explicit risk acceptance.
- Threat models MUST be revisited after significant architecture, identity, data-flow, or exposure changes.
- Assumptions that materially reduce perceived risk MUST be documented and validated.

## MUST NOT
- MUST NOT close threats merely because exploitation is inconvenient or currently uncommon.
- MUST NOT treat encryption, authentication, or network segmentation as universal mitigations without validating the specific threat.
- MUST NOT omit insider, compromised-credential, dependency, and operational misuse scenarios when relevant.

## SHOULD
- Threat modeling SHOULD include adversarial misuse and failure modes beyond normal user workflows.
- Models SHOULD be lightweight enough to remain current while still covering material risk.

## Exceptions
Reduced-scope modeling requires documented rationale, system criticality, residual risk, and approval from the accountable security authority.

## Verification
Inspect threat-model artifacts, architecture diagrams, data flows, control mappings, open threat backlog, and evidence that material changes trigger review.