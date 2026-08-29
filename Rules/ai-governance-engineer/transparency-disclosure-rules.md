# Transparency and Disclosure Rules

## Purpose
Ensure people and operators receive accurate, proportionate information about AI involvement, limitations, and material decision effects.

## Scope
Applies to user notices, operator guidance, model or system descriptions, limitations, explanations, generated-content disclosure, and governance communications.

## MUST
- Material AI-assisted interactions MUST disclose AI involvement when required by policy, law, contractual commitment, or risk assessment.
- Disclosures MUST accurately describe the system's role, relevant limitations, and available human or appeal paths when those facts affect user decisions.
- High-impact systems MUST document what explanation can be provided for outputs and what cannot be reliably inferred.
- Operator documentation MUST identify known failure modes, prohibited uses, escalation criteria, and dependencies that can change output quality.
- Public or customer-facing claims about model capability, safety, accuracy, or compliance MUST be supported by current evidence.
- Material changes that invalidate existing disclosures MUST trigger updates before or with rollout.

## MUST NOT
- MUST NOT present probabilistic model output as authoritative fact without appropriate qualification.
- MUST NOT imply that an AI system is independently certified, unbiased, safe, or compliant when evidence does not support that claim.
- MUST NOT hide material automation merely to improve adoption or reduce user concern.
- MUST NOT provide fabricated explanations for opaque model behavior.

## SHOULD
- Disclosures SHOULD be concise, contextual, and placed where users make relevant decisions.
- Technical documentation SHOULD distinguish model limitations from system-level mitigations.
- Transparency artifacts SHOULD be versioned for high-risk systems.

## Exceptions
Exceptions to normal disclosure practices MUST document the reason, affected users, risk, alternative communication, duration, and approval. Legal disclosure obligations cannot be waived by product preference.

## Verification
Review UI text, documentation, customer claims, model/system cards, operator guidance, version history, and sampled user journeys. Compare claims against current evaluation and architecture evidence.