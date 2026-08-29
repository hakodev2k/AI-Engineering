# Threat Modeling Rules

## Purpose
Identify and control security risks introduced by AI models, data flows, tools, users, and external dependencies before deployment.

## Scope
Applies to AI features, model integrations, agentic systems, RAG pipelines, fine-tuning, inference services, and changes that materially alter trust boundaries.

## MUST
- Security-sensitive AI features MUST have a documented threat model covering assets, trust boundaries, attackers, abuse cases, entry points, and mitigations.
- Threat models MUST include AI-specific threats such as prompt injection, data exfiltration, model extraction, poisoned data, unsafe tool use, cross-tenant leakage, and provider compromise where relevant.
- Material architecture changes MUST trigger threat-model review.
- High-impact risks MUST have explicit owners and verification evidence before production release.

## MUST NOT
- MUST NOT treat model alignment or vendor safety claims as substitutes for application threat modeling.
- MUST NOT approve a critical trust boundary without identifying authentication, authorization, data-handling, and failure behavior.

## SHOULD
- Use attack trees or abuse-case diagrams when they improve review quality.
- Rank mitigations by exploitability, impact, detectability, and reversibility.

## Exceptions
Exceptions require documented rationale, residual risk, compensating controls, expiration criteria, and human approval for high-risk exposure.

## Verification
Review architecture diagrams, data-flow diagrams, abuse cases, risk register, mitigation owners, test evidence, and release approvals.