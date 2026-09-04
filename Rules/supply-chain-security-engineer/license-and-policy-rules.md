# License and Policy Rules

## Purpose
Prevent security and delivery risk from prohibited, incompatible, or ungoverned third-party components.

## Scope
Applies to dependency licensing, internal software-use policy, distribution obligations, and approved component classes.

## MUST
- Production dependencies MUST be evaluated against applicable organizational and distribution policies before release.
- License or policy findings that could block distribution MUST have an accountable owner and disposition before release.
- Automated policy checks MUST use versioned, reviewable policy definitions.
- Exceptions for restricted components MUST record scope, rationale, approver, and expiration or review date.

## MUST NOT
- Security approval MUST NOT be represented as legal approval, and legal approval MUST NOT be represented as security approval.
- Teams MUST NOT remove or falsify dependency metadata to bypass policy enforcement.
- Unknown license state for a critical distributed component MUST NOT be silently accepted.

## SHOULD
- Policy tooling SHOULD distinguish informational findings from release-blocking conditions.
- Dependency replacement SHOULD be preferred when legal, security, and maintenance risk collectively exceed the value of retaining a component.

## Exceptions
Exceptions require the relevant security, engineering, and legal or policy stakeholders according to the nature of the risk.

## Verification
Review manifests, SBOMs, license scans, policy-as-code configuration, exception records, release-gate results, and component metadata.