# Third-Party Model Risk Rules

## Purpose
Control risks introduced by externally developed or managed AI models and services.

## Scope
Applies to hosted APIs, foundation models, embedded models, vendor platforms, and subcontracted AI capabilities.

## MUST
- Third-party models MUST be assessed for intended use, security, privacy, availability, update behavior, contractual constraints, and material known limitations.
- Production integrations MUST define behavior when the provider changes, degrades, suspends, or retires the service.
- Provider model-version changes that can affect behavior MUST trigger validation proportional to risk.
- Sensitive data sent to providers MUST comply with approved data-handling terms and technical controls.
- Critical dependencies MUST have documented escalation and contingency plans.

## MUST NOT
- Vendor assurances MUST NOT substitute for internal validation of risks relevant to the actual deployment.
- Auto-updating model aliases MUST NOT be used in high-risk workflows without controls that detect and assess behavioral change.

## SHOULD
- Contracts SHOULD address notification of material changes, incident communication, data use, and service continuity when feasible.
- Teams SHOULD maintain alternative operating modes for critical workflows.

## Exceptions
Any accepted vendor-control gap must document exposure, alternatives considered, compensating controls, residual risk, and approver.

## Verification
Inspect vendor assessments, contracts, provider settings, model pinning, failover tests, incident procedures, and change-validation records.