# Identity Threat Modeling
## Purpose
Identify attack paths before identity controls are deployed.
## Scope
New identity systems, major integrations, trust changes, and high-risk features.
## MUST
- Threat models MUST identify assets, actors, trust boundaries, credential types, abuse paths, and recovery paths.
- High-impact threats MUST map to preventive, detective, or recovery controls.
- Material trust or authentication changes MUST trigger threat-model review.
## MUST NOT
- Happy-path protocol compliance MUST NOT be treated as sufficient security analysis.
- Recovery and administrative paths MUST NOT be omitted from the attack surface.
## SHOULD
- Include credential theft, replay, confused-deputy, privilege escalation, and lifecycle abuse scenarios as applicable.
## Exceptions
Document scope reduction, rationale, residual risk, and approval.
## Verification
Review threat model against architecture, tests, findings, and implemented controls.