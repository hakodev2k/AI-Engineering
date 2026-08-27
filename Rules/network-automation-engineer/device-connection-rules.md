# Device Connection Rules

## Purpose
Control sessions to network devices so automation remains secure, bounded, and operationally predictable.

## Scope
SSH, APIs, NETCONF, RESTCONF, gNMI, console gateways, session pools, and transport settings.

## MUST
- Production connections MUST authenticate using approved identity and secret-management mechanisms.
- Host or server identity MUST be verified when the protocol supports it.
- Connect, read, and operation timeouts MUST be explicit and bounded.
- Session concurrency MUST respect device and control-plane capacity.
- Connection failures MUST preserve actionable diagnostics without exposing credentials.

## MUST NOT
- MUST NOT disable certificate or host-key verification merely to unblock automation.
- MUST NOT place plaintext credentials in source, logs, command lines, or generated artifacts.
- MUST NOT retry authentication failures indefinitely or at a rate that risks lockout or control-plane exhaustion.

## SHOULD
- Connections SHOULD use encrypted, structured management protocols where supported.
- Session reuse SHOULD be bounded and validated against platform behavior.

## Exceptions
Legacy insecure transport requires documented business need, isolation controls, compensating safeguards, expiry plan, and explicit security approval.

## Verification
Inspect transport configuration, secret references, certificate/host-key policy, timeout settings, retry tests, concurrency limits, and logs for credential leakage.