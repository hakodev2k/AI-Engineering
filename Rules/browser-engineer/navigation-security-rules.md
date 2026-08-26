# Navigation Security Rules
## Purpose
Ensure navigations cannot bypass origin, policy, privilege, or user-intent boundaries.
## Scope
Top-level and frame navigation, redirects, downloads, external protocols, and commit decisions.
## MUST
- Navigation authorization MUST be evaluated using browser-trusted state.
- Redirect chains MUST preserve security-policy and initiator context required by the platform.
- Privileged or external-protocol transitions MUST require applicable user or policy authorization.
## MUST NOT
- MUST NOT commit content into an incompatible security context.
- MUST NOT infer user activation when none is valid.
## SHOULD
- SHOULD make navigation state transitions auditable and deterministic.
## Exceptions
Any relaxation requires threat analysis, compatibility evidence, and security approval.
## Verification
Run origin, redirect, sandbox, CSP, user-activation, download, and adversarial navigation tests.