# Inference API Security Rules

## Purpose
Secure AI inference interfaces against unauthorized access, abuse, denial of service, injection, and data leakage.

## Scope
Applies to public and internal inference APIs, streaming endpoints, batch inference, gateways, and model-serving interfaces.

## MUST
- Inference endpoints MUST enforce authentication and authorization appropriate to their exposure and data sensitivity.
- Requests MUST have validated size, type, rate, and resource limits.
- Expensive operations MUST have quotas or equivalent abuse controls.
- Error responses MUST avoid leaking internal prompts, stack traces, secrets, or protected architecture details.
- External requests MUST be subject to timeout and cancellation controls.

## MUST NOT
- MUST NOT expose unrestricted administrative or debugging endpoints to untrusted networks.
- MUST NOT trust user-supplied tenant, role, or privilege claims without server-side verification.
- MUST NOT accept unbounded payloads or generation parameters that can exhaust shared resources.

## SHOULD
- Apply layered throttling by identity, tenant, endpoint, and cost where useful.
- Detect anomalous request patterns and credential sharing.

## Exceptions
Exceptions require documented traffic assumptions, bounded exposure, compensating controls, and approval.

## Verification
Run authorization, fuzzing, quota, payload-limit, timeout, error-leakage, and denial-of-service tests; inspect gateway and serving configuration.