# Network Threat Modeling
## Purpose
Make network-security decisions against explicit adversary paths and assets.
## Scope
New architectures, major connectivity changes, Internet exposure, privileged paths, and critical services.
## MUST
- Threat models MUST identify assets, trust boundaries, entry points, attacker capabilities, and material abuse paths.
- Mitigations MUST map to identified threats rather than generic control lists alone.
- Residual high-impact risks MUST have explicit ownership.
- Material architecture changes MUST trigger threat-model review.
## MUST NOT
- Network diagrams MUST NOT be treated as threat models by themselves.
- Controls MUST NOT be assumed effective without considering bypass paths.
## SHOULD
- Threat models SHOULD prioritize realistic attack paths and operational failure modes.
## Exceptions
For low-risk changes, a scoped documented assessment may replace a full model.
## Verification
Review model assumptions, diagrams, abuse cases, control mappings, residual risks, and test evidence.