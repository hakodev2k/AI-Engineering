# Permissions and Component Exposure Rules

## Purpose
Minimize Android privilege and inter-process attack surface while preserving user trust.

## Scope
Applies to runtime permissions, manifest permissions, Activities, Services, Receivers, Providers, intents, and IPC.

## MUST
- Request only permissions necessary for a current user-facing capability and handle denial/revocation safely.
- Explicitly classify every exported component and protect sensitive exported entry points with appropriate validation and permissions.
- Validate intent extras, URIs, caller assumptions, and provider inputs before privileged use.
- Explain sensitive permission requests in context when platform UX permits.

## MUST NOT
- Request broad storage, location, notification, microphone, camera, or similar access merely for future convenience.
- Trust implicit intents or external callers as authenticated identities without a valid mechanism.
- Expose mutable PendingIntents or equivalent capabilities more broadly than required.

## SHOULD
- Prefer scoped platform APIs and least-capability alternatives.
- Periodically remove obsolete permissions and exported surfaces.

## Exceptions
Broad permissions require a documented necessity, policy review, security assessment, and user-impact justification.

## Verification
Inspect merged manifests, runtime permission flows, exported-component tests, security scans, and adversarial intent/provider inputs.