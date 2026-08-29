# Vendor and Model Dependency Rules

## Purpose
Control product risk created by third-party models, APIs, tooling, and platform dependencies.

## Scope
Applies to external model providers, hosted APIs, data services, moderation providers, and critical AI platform dependencies.

## MUST
- Critical third-party dependencies MUST document service assumptions, data handling, availability expectations, pricing exposure, and exit strategy.
- Product requirements MUST account for provider rate limits, outages, model deprecations, policy changes, and regional availability.
- Material provider or model substitutions MUST pass compatibility and regression evaluation before broad rollout.
- Contractual or privacy commitments MUST be checked against actual vendor behavior and terms.

## MUST NOT
- MUST NOT make an external provider a hidden single point of failure without acknowledging and accepting the risk.
- MUST NOT assume two models are interchangeable because they expose similar APIs.
- MUST NOT route sensitive data to a provider not approved for that data class.

## SHOULD
- Critical workflows SHOULD support graceful degradation or an alternative path where economically justified.
- Vendor reviews SHOULD consider portability costs and concentration risk.

## Exceptions
Exceptions require documented dependency risk, business justification, compensating controls, and decision-owner approval.

## Verification
Inspect architecture diagrams, vendor terms, data-flow reviews, failover plans, model regression reports, and dependency risk records.