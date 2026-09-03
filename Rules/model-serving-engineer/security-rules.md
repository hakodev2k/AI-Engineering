# Security Rules

## Purpose
Protect model-serving infrastructure, artifacts, requests, and outputs from unauthorized access and abuse.

## Scope
Applies to authentication, authorization, secrets, network access, runtime hardening, and inference abuse controls.

## MUST
- Authenticate callers and enforce authorization at the appropriate trust boundary.
- Store credentials and signing material in approved secret-management systems.
- Apply least privilege to model registries, object stores, deployment identities, and accelerator hosts.
- Validate and bound externally controlled inputs before resource-intensive execution.
- Patch or mitigate critical serving-runtime vulnerabilities according to risk and exposure.

## MUST NOT
- Embed secrets in images, source code, model artifacts, or configuration committed to repositories.
- Disable authentication, TLS, sandboxing, or policy controls merely to restore service without explicit emergency approval.
- Expose internal administration endpoints to untrusted networks.

## SHOULD
- Segment control-plane and data-plane access.
- Use dependency and image scanning as release gates for defined severity thresholds.

## Exceptions
Security-control exceptions require threat analysis, compensating controls, owner, expiry, and human approval.

## Verification
Use configuration inspection, access tests, secret scanning, vulnerability scanning, network-policy review, and penetration or abuse testing where appropriate.