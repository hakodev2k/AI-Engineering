# Deep Link and Universal Link Rules
## Purpose
Prevent unsafe routing and preserve reliable external entry points.
## Scope
Custom schemes, universal/app links, deferred links, route parameters, and external navigation.
## MUST
- Incoming link parameters MUST be validated and normalized before navigation or action.
- Privileged actions reached by links MUST require normal authorization and confirmation controls.
- Domain association files and application link configuration MUST be environment-correct.
## MUST NOT
- Sensitive actions MUST NOT execute solely from an untrusted URL without user/context validation.
- Secrets MUST NOT be placed in URLs where logs, history, or other apps can expose them.
## SHOULD
- Prefer verified domain links over custom schemes for externally trusted routing.
## Exceptions
Custom schemes may be required for third-party interoperability with documented spoofing mitigations.
## Verification
Test malformed links, hostile parameters, unauthenticated state, wrong environments, domain verification, and fallback behavior.