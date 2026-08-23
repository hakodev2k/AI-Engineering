# Authentication Rules

## Purpose
Ensure authentication mechanisms resist account takeover and provide auditable assurance.

## Scope
Interactive and non-interactive authentication for users, administrators, services, and privileged systems.

## MUST
- Authentication strength MUST match account privilege, data sensitivity, and threat model.
- MFA MUST be required for privileged access and other risk-significant access paths.
- Authentication failures, lockouts, factor enrollment, resets, and recovery events MUST be auditable.
- Recovery flows MUST provide assurance comparable to the primary authentication path.
- Session establishment MUST bind to the authenticated identity and approved context.

## MUST NOT
- MUST NOT allow shared passwords or credentials for individually attributable administrative access.
- MUST NOT weaken authentication controls to resolve usability issues without documented risk acceptance.
- MUST NOT rely on knowledge-based questions as a sole high-assurance recovery mechanism.

## SHOULD
- Phishing-resistant factors SHOULD be preferred for privileged and high-risk users.
- Risk-based controls SHOULD supplement, not silently replace, baseline authentication requirements.

## Exceptions
Any reduction in required assurance requires documented threat analysis, compensating controls, owner, expiry, and security approval.

## Verification
Review IdP policies, factor enrollment reports, recovery procedures, authentication logs, privileged-account samples, and penetration-test evidence.