# Mobile Security Rules
## Purpose
Reduce mobile-specific attack surface and protect users, data, and backend services.
## Scope
Application security, transport security, exported components, web views, IPC, tampering, and secure defaults.
## MUST
- External inputs from links, intents, notifications, files, clipboard, web content, and IPC MUST be treated as untrusted.
- Transport security MUST use supported TLS and production trust configuration.
- Exported platform components MUST be minimized and explicitly protected.
- Security-sensitive decisions MUST be enforced server-side when a compromised client could bypass them.
## MUST NOT
- Certificate validation MUST NOT be disabled to unblock production traffic.
- Embedded web content MUST NOT expose privileged native bridges to untrusted origins.
## SHOULD
- Mobile threat modeling SHOULD cover lost devices, rooted/jailbroken environments, repackaging, and local inspection where relevant.
## Exceptions
Security-control exceptions require documented threat impact, compensating controls, expiry, and human approval.
## Verification
Use static analysis, mobile security testing, manifest/entitlement inspection, proxy testing, and threat-model review.