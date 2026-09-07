# Threat Modeling Rules

## Purpose
Ensure Zero Trust architecture and policy respond to concrete attacker goals, trust-boundary failures, and abuse paths.

## Scope
Applies to new systems, major architecture changes, privileged workflows, sensitive integrations, and high-value data paths.

## MUST
- Threat models MUST identify protected assets, actors, trust boundaries, entry points, privileged operations, and plausible abuse paths.
- Models MUST consider credential theft, session theft, lateral movement, compromised devices, workload impersonation, policy bypass, and insider misuse where relevant.
- Significant control decisions MUST trace to explicit threats or risk assumptions.
- Threat models MUST be updated after material architecture or trust-boundary changes.

## MUST NOT
- MUST NOT assume internal actors, networks, or workloads are inherently trusted.
- MUST NOT treat a checklist as a substitute for system-specific attack-path analysis.
- MUST NOT accept mitigations without identifying how they reduce likelihood, impact, or detectability.

## SHOULD
- Threat modeling SHOULD involve system owners and operational responders for critical systems.
- High-risk paths SHOULD receive adversarial validation or security testing.

## Exceptions
Reduced-scope modeling requires documented rationale, bounded risk, reviewer approval, and a defined follow-up trigger.

## Verification
Review model artifacts, architecture diagrams, abuse cases, mitigation traceability, unresolved risks, and evidence from security tests or exercises against the modeled attack paths.