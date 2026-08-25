# Network Access Control
## Purpose
Ensure only authorized identities and devices obtain appropriate network access.
## Scope
802.1X, NAC, device profiling, guest access, and quarantine.
## MUST
- Access decisions MUST distinguish managed, unmanaged, guest, and unknown devices.
- Failed posture or identity checks MUST result in bounded access appropriate to risk.
- Enforcement policy MUST have tested fail-open/fail-closed behavior.
- Exceptions MUST be attributable and periodically reviewed.
## MUST NOT
- Device MAC address alone MUST NOT be treated as strong identity.
- Quarantine paths MUST NOT expose protected resources.
## SHOULD
- NAC SHOULD integrate with authoritative identity and asset sources.
## Exceptions
Document operational need, risk, owner, expiry, and compensating monitoring.
## Verification
Test onboarding, rejection, quarantine, failover, identity mapping, and policy logs.