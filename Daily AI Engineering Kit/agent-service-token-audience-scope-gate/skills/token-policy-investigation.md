# Token Policy Investigation

## Purpose
Determine whether a service-to-service authentication failure or authorization gap is caused by issuer, audience, lifetime, client identity, or scope/role configuration.

## When to use
Use during API integration, 401/403 investigation, identity-provider migration, new service onboarding, or before changing token validation rules.

## Inputs
- API/service identifier.
- Expected identity provider issuer.
- Expected resource/audience.
- Required operation and least-privilege scopes/roles.
- Sanitized token claims or middleware diagnostics.
- Relevant authentication configuration and tests.

## Preconditions
Signature validation must remain enabled. Raw production tokens must not be copied into agent context.

## Allowed tools
Repository search, test runner, identity-provider documentation, sanitized logs, `scripts/token_gate.py`.

## Constraints
Do not grant permissions or relax production policy. Do not infer validity from a decoded JWT alone.

## Procedure
1. Locate authentication middleware and authorization policy entry points.
2. Record configured issuer, audience, scope/role checks, clock skew, and key discovery mechanism.
3. Identify whether the caller is delegated-user, workload/client-credential, or mixed.
4. Obtain sanitized claims containing only `iss`, `aud`, `scp`/`roles`, `exp`, `nbf`, `iat`, `sub`, and `azp`/`appid`.
5. Compare claims to the intended resource and operation.
6. Run `python scripts/token_gate.py --claims-file <claims.json> --policy config/policy.yaml`.
7. Classify each mismatch as configuration, caller permission, wrong token resource, expired/not-yet-valid token, or incomplete evidence.
8. Trace tests covering the exact policy.
9. Recommend the smallest safe change.
10. Re-run deterministic checks and application tests.

## Expected output
A finding set with evidence, affected component, confidence, risk, recommended action, and verification status.

## Verification
All required claims pass the deterministic gate, cryptographic validation remains enabled, and service authorization tests pass.

## Failure handling
On missing evidence, stop with `incomplete-evidence`. On permission errors, stop without increasing privileges. Transient documentation/tool failures may retry twice.

## Stop conditions
Stop before any production permission grant, identity-provider policy relaxation, secret change, or breaking auth contract.
