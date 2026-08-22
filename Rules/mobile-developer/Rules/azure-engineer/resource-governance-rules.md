# Resource Governance Rules

## Purpose
Keep Azure estates accountable, discoverable, policy-compliant, and manageable at scale.

## Scope
Management groups, subscriptions, resource groups, naming, tags, Azure Policy, locks, ownership, and lifecycle.

## MUST
- Place resources in governance boundaries that reflect ownership, environment, and policy requirements.
- Define mandatory metadata for ownership, environment, service, and cost attribution where applicable.
- Use policy to enforce high-value guardrails that are practical to automate.
- Assign an accountable owner and lifecycle expectation to production resources.
- Review policy exemptions with expiry and business justification.

## MUST NOT
- Use resource locks as a substitute for authorization design.
- Create unmanaged production subscriptions or resource groups without ownership.
- Leave permanent policy exemptions without review dates.

## SHOULD
- Prefer preventive policy over manual compliance checks for deterministic requirements.

## Exceptions
Exceptions require scope, rationale, risk, compensating control, owner, and expiry.

## Verification
Inspect hierarchy, policy assignments, exemptions, tags, resource ownership, locks, and compliance reports.