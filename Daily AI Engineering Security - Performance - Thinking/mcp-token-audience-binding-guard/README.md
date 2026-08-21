# MCP Token Audience Binding Guard

**Category:** Security

## Problem
An OAuth token can be cryptographically valid yet still be wrong for a particular MCP resource. Missing audience/issuer/active-state checks or inbound-token passthrough can create authentication bypass and confused-deputy paths.

## Evidence
See `evidence/research.md`. MCP's July 2026 guidance requires audience/resource binding and prohibits token passthrough. CVE-2026-14541 provides current concrete evidence of audience confusion in a real MCP implementation, while CVE-2026-11718 shows a distinct fail-open issuer-validation failure mode.

## Existing approach and limitations
Signature validation, introspection, and broad OAuth scopes are necessary but insufficient when resource identity is implicit, missing claims fail open, or the inbound credential is reused downstream.

## Proposed improvement
Apply a metadata-only action-time guard after cryptographic validation/introspection. Require explicit MCP resource/audience, allowed issuer, active state, operation scopes, and separate downstream credentials. Reject raw token material from the guard contract.

## Architecture
```text
mcp-token-audience-binding-guard/
├── README.md
├── evidence/research.md
├── config/policy.json
├── scripts/token_binding_guard.py
├── tests/test_token_binding_guard.py
├── skills/mcp-auth-boundary-analysis.md
├── rules/token-handling.md
└── workflows/authorize-and-verify.md
```

## Installation
Python 3.10+; standard library only. The script is a policy guard, not a JWT verifier. Perform signature/introspection validation in the identity layer first.

## Configuration
Replace example resource and issuer values in `config/policy.json` with deployment-specific canonical values. Define minimum scopes per protected operation.

## Input contract
Example non-secret metadata:
```json
{"issuer":"https://issuer.example.internal","audiences":["https://mcp.example.internal"],"active":true,"scopes":["mcp.read"],"operation":"read","passthrough_requested":false,"downstream_target":null}
```
Never include actual bearer/refresh tokens or client secrets.

## Usage
```bash
python scripts/token_binding_guard.py request-metadata.json --policy config/policy.json
python -m unittest tests/test_token_binding_guard.py
```
Exit codes: `0` allow, `2` invalid input/configuration, `5` deny.

## Workflow
Follow `workflows/authorize-and-verify.md`: observe → baseline adversarial paths → diagnose → implement explicit boundaries → remeasure → independent security verification. Remediation retries are bounded to two per root cause.

## Metrics
Protected-action coverage; denied wrong-audience/issuer/missing-active/missing-scope/passthrough paths; raw-secret leakage count; least-privilege scope coverage.

## Verification
**Implemented:** explicit audience/resource, issuer, active-state, scope, passthrough, and secret-field checks plus deterministic tests.

**Measured:** baseline and candidate attack-fixture acceptance/denial counts are measured in the deployment; the package does not claim the deployment is secure merely because code exists.

**Verified:** all included and application-specific security fixtures pass, valid requests still work, no credentials appear in logs, downstream credentials are separate, and an independent reviewer verifies high-impact changes.

## Safety
Fail closed on missing required metadata. Never log or prompt raw credentials. Never weaken audience/issuer validation for compatibility. Never reuse inbound MCP bearer tokens for downstream resources. Dangerous authorization changes require explicit human approval under the owning team's change process.

## Failure handling
Detection is a denied fixture, invalid metadata, secret-field detection, or integration security failure. Preserve evidence without secrets. Retry remediation at most twice per cause. Fallback is containment/previous approved safe behavior, not bypassing checks. Escalate unresolved identity-provider/resource ambiguity and stop completion.

## Definition of Done
Current evidence recorded; canonical resource and issuer configured; protected operations mapped to scopes; attack paths denied; valid path passes; downstream credentials separated; tests pass; no secrets exposed; independent verification complete; no blocking issue remains.

## Customization
Extend the non-secret metadata contract for tenant or client identity only when those attributes are validated upstream. Keep resource/audience binding and no-passthrough rules mandatory.
