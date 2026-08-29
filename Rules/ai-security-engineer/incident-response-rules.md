# AI Security Incident Response Rules

## Purpose
Contain, investigate, remediate, and learn from security incidents involving AI systems.

## Scope
Applies to model abuse, prompt injection, data leakage, compromised providers, poisoned data, credential exposure, unauthorized tool actions, model theft, and safety-control bypasses.

## MUST
- AI security incidents MUST have defined severity, ownership, escalation, containment, and communication paths.
- Responders MUST preserve evidence needed to reconstruct model inputs, relevant outputs, policy decisions, tool actions, model versions, and authorization events while respecting privacy constraints.
- Containment actions MUST prioritize stopping ongoing harm and limiting blast radius.
- Credential or secret compromise MUST trigger appropriate revocation or rotation.
- Material incidents MUST produce root-cause analysis or a clearly bounded causal assessment and tracked corrective actions.

## MUST NOT
- MUST NOT destroy or alter relevant evidence without documented necessity.
- MUST NOT restore a vulnerable capability to production before required mitigations or approved risk acceptance.
- MUST NOT treat model unpredictability as an adequate root-cause explanation.

## SHOULD
- Maintain runbooks for high-probability AI-specific incidents.
- Exercise incident scenarios before a major launch.

## Exceptions
Emergency containment may bypass ordinary change procedures when necessary to stop active harm, but actions MUST be logged and retrospectively reviewed.

## Verification
Review incident runbooks, exercise records, audit logs, evidence retention, containment controls, postmortems, and remediation closure evidence.