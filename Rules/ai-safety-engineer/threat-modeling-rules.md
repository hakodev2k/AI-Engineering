# AI Threat Modeling Rules

## Purpose
Ensure adversarial misuse and abuse paths are systematically identified before release.

## Scope
Covers model interfaces, agents, tools, retrieval, plugins, memory, identity boundaries, and external integrations.

## MUST
- Identify trust boundaries, attacker goals, reachable assets, privilege transitions, and abuse paths.
- Model both malicious users and compromised upstream/downstream components.
- Revisit the threat model when permissions, tools, model capability, or exposure changes.
- Link material threats to mitigations and verification evidence.

## MUST NOT
- Assume natural-language policy alone is a security boundary.
- Assume internal users or authenticated callers are non-adversarial.
- Mark a threat mitigated without testing the actual control.

## SHOULD
- Include chained attacks where individually low-risk actions compose into high-impact behavior.
- Review threat models with security and domain owners for high-impact systems.

## Exceptions
Scope reductions require rationale, evidence that excluded surfaces are unreachable or immaterial, and reviewer approval.

## Verification
Inspect architecture diagrams, trust boundaries, abuse cases, mitigation mappings, adversarial tests, and unresolved risks during design and release review.
