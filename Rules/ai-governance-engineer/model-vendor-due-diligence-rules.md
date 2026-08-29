# Model and Vendor Due Diligence Rules

## Purpose
Control risks introduced by third-party models, hosted AI services, data processors, and vendor-controlled system changes.

## Scope
Applies to model providers, AI SaaS, foundation models, hosted inference, embedded vendor AI, subcontractors, and material external dependencies.

## MUST
- Material AI vendors MUST be assessed before production use for security, privacy, data handling, availability, model-change practices, support, contractual controls, and relevant compliance commitments.
- Due diligence MUST identify what the provider can change without customer approval, including model versions, safety controls, retention behavior, and service terms.
- Contracts or equivalent enforceable commitments MUST address material data use, confidentiality, breach notification, deletion, availability, and exit requirements where applicable.
- Vendor evidence MUST be evaluated for scope and recency rather than accepted solely because a certification or attestation exists.
- Critical vendors MUST have dependency, concentration, continuity, and replacement risk assessed.
- Vendor changes that can alter system behavior or risk MUST trigger reassessment.

## MUST NOT
- MUST NOT send restricted data to a provider without confirmed authorization and data-handling terms.
- MUST NOT treat vendor marketing claims as sufficient evidence of security, safety, fairness, or regulatory compliance.
- MUST NOT assume a provider's default configuration matches project requirements.

## SHOULD
- Teams SHOULD prefer contractual and technical controls that reduce reliance on provider promises alone.
- High-risk systems SHOULD have tested fallback, migration, or shutdown options when provider failure would cause material harm.

## Exceptions
Exceptions MUST state the unmet diligence requirement, business need, compensating safeguards, exposure duration, exit plan, and approving authority. Unresolved critical data-use or security concerns require escalation before production use.

## Verification
Inspect vendor assessments, contracts, security reports, data-processing terms, provider configuration, architecture diagrams, change notices, and sampled traffic. Confirm reassessment occurs after material provider changes.