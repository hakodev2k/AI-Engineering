# Threat Modeling Rules

## Purpose
Define mandatory practices for identifying, prioritizing, and mitigating security threats before they become production incidents.

## Scope
Applies to new systems, material architecture changes, high-risk integrations, identity flows, sensitive data paths, and significant feature changes.

## MUST
- Threat models MUST identify trust boundaries, assets, actors, data flows, abuse cases, and plausible attacker goals.
- High-impact changes MUST document mitigations, residual risk, and ownership for unresolved findings.
- Threat modeling MUST occur early enough to influence architecture and design decisions.
- Security assumptions MUST be explicit and validated against system behavior.
- Models MUST be updated when trust boundaries, identity mechanisms, or sensitive data flows materially change.

## MUST NOT
- MUST NOT treat compliance checklists as a substitute for threat modeling.
- MUST NOT dismiss threats solely because exploitation is considered unlikely without evidence.
- MUST NOT leave critical findings without an owner or disposition.

## SHOULD
- Use a repeatable methodology such as STRIDE, attack trees, or equivalent structured analysis.
- Prefer mitigations that reduce entire classes of threats rather than single symptoms.

## Exceptions
Low-risk changes may use a lightweight review if scope, rationale, and reviewer approval are recorded.

## Verification
Verify by architecture review, threat-model artifacts, issue tracking, mitigation evidence, and security test coverage.