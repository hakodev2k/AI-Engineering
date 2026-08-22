# Security UX Rules
## Purpose
Make secure behavior understandable without weakening controls.
## Scope
Authentication, authorization, recovery, sensitive actions, and warnings.
## MUST
- Communicate security-sensitive consequences before high-risk actions.
- Design recovery and authentication with security owners when abuse risk is material.
- Avoid disclosures that create enumeration risk.
- Require approval before UX changes weaken a security control.
## MUST NOT
- Remove security friction solely to improve conversion without risk approval.
- Imply unsupported security guarantees.
## SHOULD
- Explain security steps without exposing exploitable details.
## Exceptions
Emergency mitigations require security approval and follow-up review.
## Verification
Threat-model relevant flows and inspect states, recovery, permissions, and approval evidence.