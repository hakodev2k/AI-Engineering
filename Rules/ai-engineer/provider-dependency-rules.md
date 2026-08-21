# Provider Dependency Rules
## Purpose
Control operational, compatibility, security, and lock-in risk from AI providers and SDKs.
## Scope
Hosted models, inference APIs, SDKs, embedding services, vector services, and provider-specific features.
## MUST
- Document provider-specific assumptions, quotas, data handling, model lifecycle, and failure behavior for production dependencies.
- Pin or otherwise control dependency and model upgrades where changes can alter behavior.
- Evaluate material provider or model-version changes before production rollout.
- Define migration or fallback options for critical provider dependencies.
## MUST NOT
- Assume a provider alias always represents identical model behavior over time.
- Perform large provider migrations without compatibility, cost, security, and rollback review.
## SHOULD
- Isolate provider-specific integration behind clear interfaces when portability has material value.
## Exceptions
Tight coupling may be accepted when benefits exceed migration risk and the decision is documented.
## Verification
Inspect dependency manifests, model identifiers, provider settings, evaluation reports, migration plans, and release controls.