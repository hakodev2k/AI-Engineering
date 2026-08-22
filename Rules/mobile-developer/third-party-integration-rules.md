# Third-Party Integration Rules
## Purpose
Contain reliability, security, privacy, and lifecycle risk from external mobile services.
## Scope
Payments, maps, identity, social, analytics, messaging, device vendors, and external SDK/API integrations.
## MUST
- Integrations MUST define failure, timeout, cancellation, version compatibility, and degraded-mode behavior.
- Sensitive third-party actions MUST be validated against authoritative backend state where client tampering creates risk.
- Data shared externally MUST be documented and limited to approved purpose.
## MUST NOT
- Third-party callbacks MUST NOT be trusted without required signature, state, nonce, or equivalent protocol validation.
- Vendor availability MUST NOT become an undocumented single point of failure for unrelated critical flows.
## SHOULD
- Integrations SHOULD sit behind replaceable boundaries when vendor churn or outage risk is material.
## Exceptions
Deep vendor coupling may be justified by unique platform capability with explicit dependency acceptance.
## Verification
Test vendor outage, timeout, malformed callback, SDK upgrade, revoked credentials, privacy behavior, and fallback paths.