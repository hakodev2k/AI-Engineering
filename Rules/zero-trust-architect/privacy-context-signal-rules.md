# Privacy and Context Signal Rules

## Purpose
Ensure Zero Trust context collection remains proportionate, purpose-bound, protected, and compatible with privacy obligations.

## Scope
Applies to identity, device, location, behavior, network, workload, and risk signals collected or processed for access control and security monitoring.

## MUST
- Each contextual signal MUST have a documented security purpose, accountable owner, access policy, retention requirement, and data-minimization rationale.
- Systems MUST collect only the signal precision and history necessary for the defined access or security decision.
- Sensitive context data MUST be protected in transit and at rest according to its classification and MUST be access-controlled independently from ordinary application data where risk warrants.
- Retention MUST be bounded by operational, investigative, legal, and regulatory needs and MUST be periodically reviewed.
- Context used for automated access decisions MUST have documented semantics so reviewers can understand what is evaluated and why.
- Cross-border, employee-monitoring, biometric, or similarly sensitive signal use MUST be reviewed against applicable legal and organizational requirements before deployment.
- Security telemetry access MUST itself be auditable when the data can reveal sensitive user, device, or business information.

## MUST NOT
- Zero Trust architecture MUST NOT be used as justification for unrestricted surveillance or indefinite behavioral-data retention.
- Precise location, content, or personal data MUST NOT be collected when a less sensitive signal provides sufficient assurance.
- Context signals collected for access security MUST NOT be silently repurposed for unrelated uses without appropriate review.
- Logs and decision records MUST NOT expose unnecessary personal or confidential information to broad operational audiences.

## SHOULD
- Derived or coarse-grained signals SHOULD replace raw sensitive data when they provide adequate decision quality.
- Privacy impact assessment SHOULD occur early for architectures using extensive behavioral, device, or location context.
- Signal deletion and subject-rights workflows SHOULD be testable where applicable.

## Exceptions
Exceptions require documented purpose, necessity, alternatives considered, data categories, retention, risk, legal or privacy review when applicable, owner, and approval.

## Verification
Inspect data-flow diagrams, signal inventories, retention configuration, access controls, privacy assessments, logging schemas, sample decisions, and deletion procedures. Verify that collected fields match documented necessity.