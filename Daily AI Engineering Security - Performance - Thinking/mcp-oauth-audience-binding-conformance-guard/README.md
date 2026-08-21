# MCP OAuth Audience Binding Conformance Guard

## Topic
MCP OAuth resource/audience binding and token-passthrough conformance.

## Category
Security

## Problem
Remote MCP OAuth integrations can appear to authenticate successfully while still violating the resource boundary that should restrict each access token to one intended MCP server. Recent implementation bugs show both failure directions: clients omit the RFC 8707 resource indicator, and servers issue or accept tokens with incorrect/broad audiences. Gateways can further undermine isolation by forwarding inbound MCP bearer tokens to upstream APIs.

The practical failure mode is dangerous because signature-valid tokens from the same issuer may be accepted by the wrong service unless audience/resource checks are explicit. Compatibility workarounds can also tempt teams to disable audience validation after 401 errors, turning an interoperability problem into a security problem.

## Evidence
See `evidence/research.md` for current public signals and source links. The evidence includes:
- MCP 2026-07-28 requirements for resource-bound tokens, audience validation, and no token passthrough;
- n8n client issue #30733 where `resource` was omitted;
- n8n server issue #30500 where `aud` was hardcoded instead of honoring the requested resource;
- Apache Solr MCP work adding audience validation;
- 2026 measurement research showing widespread OAuth weaknesses in real remote MCP deployments.

## Existing approach
Teams generally rely on OAuth/JWT framework middleware, IdP configuration, RFC 8707/RFC 9728 guidance, and manual integration testing. These are necessary but not sufficient because resource binding spans multiple components: client request construction, authorization server issuance, refresh behavior, resource-server validation, proxy forwarding, and upstream API credentials.

## Existing limitations
- Browser consent success does not prove the resulting token is bound to the target resource.
- Valid signature/issuer checks may still accept a token intended for another sibling API.
- Client and server bugs can occur independently.
- IdPs differ in how resource intent is expressed; a request-shape check alone is insufficient.
- Refresh flows can drift from initial resource intent.
- Generic integration tests rarely include wrong-audience negative fixtures.
- Token passthrough may preserve a confused-deputy path even after inbound validation is fixed.

## Proposed improvement
Use a deterministic conformance layer around the existing OAuth implementation:

1. define one canonical public MCP resource identity;
2. validate authorization/token/refresh resource intent;
3. verify the effective token issuer/audience/expiry/scope in tests;
4. deliberately test sibling-resource tokens;
5. prevent inbound-token passthrough to upstream APIs;
6. retain machine-readable evidence in CI;
7. require independent verification before declaring a deployment secure.

The included Python guard is deliberately **not** a JWT signature verifier. Production OAuth/JWT middleware remains responsible for cryptographic validation and key lifecycle management.

## Architecture

```text
MCP Client
   |
   | authorize/token/refresh request
   v
[Request Binding Gate] ---- policy/canonical resource
   |
   v
Authorization Server
   |
   | resource-bound access token
   v
[Production JWT Middleware]
   |
   | cryptographic validation
   v
[Audience/Scope Conformance Gate]
   |
   v
MCP Server
   |
   | optional upstream call
   v
[Passthrough Guard] ---- requires separate upstream token
   |
   v
Upstream API
```

CI exercises the same invariants with sanitized requests and decoded test claim sets.

## Package structure

```text
mcp-oauth-audience-binding-conformance-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── fixtures/
│   ├── authorize-valid.json
│   ├── refresh-valid.json
│   ├── token-valid.json
│   └── token-wrong-audience.json
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   └── mcp_oauth_guard.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_guard.py
├── verification/
│   └── verification.md
└── workflows/
    └── workflows.md
```

## Installation
Requirements: Python 3.10+; no third-party package is required for the deterministic guard.

```bash
python scripts/mcp_oauth_guard.py --help
python scripts/mcp_oauth_guard.py check-policy --policy config/policy.json
```

For a real deployment, separately configure a maintained OAuth/JWT middleware that cryptographically validates the access token.

## Configuration
Edit `config/policy.json`:
- `canonical_resource`: exact public HTTPS MCP resource;
- `trusted_issuers`: exact accepted issuer(s);
- `required_scopes`: minimum scopes for the protected operation;
- resource-request flags: expected authorize/token/refresh binding behavior;
- `forbid_inbound_token_passthrough`: keep `true` for MCP gateways;
- `max_validation_retries`: keep bounded;
- `fail_closed`: keep `true`.

Provider-specific adapters may translate how resource intent is requested, but they must demonstrate that the resulting token is still restricted to the canonical resource.

## Usage
Validate policy:

```bash
python scripts/mcp_oauth_guard.py check-policy --policy config/policy.json
```

Validate a sanitized authorization request:

```bash
python scripts/mcp_oauth_guard.py check-request \
  --policy config/policy.json \
  --stage authorize \
  --input fixtures/authorize-valid.json
```

Validate test claims:

```bash
python scripts/mcp_oauth_guard.py check-token \
  --policy config/policy.json \
  --claims fixtures/token-valid.json \
  --now 1900000000
```

The wrong-audience fixture must fail:

```bash
python scripts/mcp_oauth_guard.py check-token \
  --policy config/policy.json \
  --claims fixtures/token-wrong-audience.json \
  --now 1900000000
```

Run regression tests:

```bash
python tests/test_guard.py
```

See `guide-intergration.md` for deployment wiring and provider-adapter guidance.

## Workflow
Primary flow:

**Observe → Baseline → Resolve canonical resource → Inspect authorize/token/refresh → Verify effective token audience → Run negative sibling-resource test → Verify separate upstream credential → Implement → Independently rerun → Gate rollout**

The workflow is bounded. A transient capture failure gets one retry; implementation/test cycles are capped at two before escalation. Security controls are never relaxed merely to make authentication succeed.

## Skills
`skills/core-skills.md` contains reusable procedures for:
- establishing canonical MCP resource identity;
- validating client resource binding;
- verifying resource-server audience enforcement;
- detecting inbound-token passthrough.

Each skill includes triggers, inputs, preconditions, procedure, decisions, metrics, verification, failure handling, and stop conditions.

## Rules
`rules/engineering-rules.md` provides observable MUST / MUST NOT / SHOULD rules. The central invariants are exact resource binding, strict audience validation, no wildcard compatibility bypass, no bearer-token passthrough, sanitized evidence, and fail-closed behavior.

## Subagents
`subagents/subagents.md` separates three responsibilities:
- Authorization Evidence Analyst;
- Authorization Implementer;
- Independent Authorization Verifier.

The implementer cannot be the sole verifier of a security-sensitive change.

## Hooks
`hooks/hooks.md` defines pre-task policy validation, pre-auth request checks, post-token claim checks, pre-upstream passthrough detection, and CI final verification.

## Metrics
Track at minimum:
- valid resource-bound fixture acceptance rate: target 100%;
- wrong/sibling audience rejection rate: target 100%;
- mandatory negative-fixture coverage: target 100%;
- passthrough count: target 0;
- metadata/canonical-resource mismatch count: target 0;
- refresh resource-drift count: target 0;
- false accepts: target 0.

Do not claim a production improvement until these are measured against the actual integration.

## Verification
`verification/verification.md` explicitly distinguishes:

**Implemented:** the package contains the policy, tooling, fixtures, procedures, hooks, and tests.

**Measured:** testable metrics and acceptance thresholds are encoded; deployment-specific measurements must be collected during integration.

**Verified:** a real deployment reaches this state only after an independent verifier proves correct-resource success, sibling-resource rejection, issuer/expiry/scope enforcement, refresh consistency, no passthrough, and absence of secret leakage.

## Safety
- Never commit real bearer tokens, refresh tokens, authorization codes, client secrets, signing keys, or session cookies.
- The fingerprint comparator emits SHA-256 values, not token contents.
- Do not weaken audience validation to fix a provider/client compatibility problem.
- Do not accept an issuer-wide token universe as a substitute for resource authorization.
- Do not use this package's decoded-claims checker as production JWT verification.
- Production changes to IdP applications, credentials, or protected resources require the organization's normal approval process.

## Failure handling
**Detection:** failed conformance command, wrong-resource token accepted, resource metadata mismatch, refresh drift, or identical inbound/outbound token fingerprint.

**Evidence:** sanitized request data, non-secret decoded claims, policy version, validator JSON, token hashes only.

**Retry:** one infrastructure retry; maximum two implementation/test cycles.

**Fallback:** restore known strict configuration or block the integration.

**Escalation:** IdP/platform/security owner when provider behavior prevents demonstrable audience restriction.

**Stop:** never proceed while wrong-resource tokens are accepted or token passthrough cannot be excluded.

## Definition of Done
The reusable package is complete when:
- current evidence and existing limitations are documented;
- canonical resource policy exists;
- actionable Skills, enforceable Rules, useful Subagents, bounded Workflows, and Hooks exist;
- deterministic scripts contain working implementation, input validation, safe defaults, meaningful exit codes, and no destructive behavior;
- positive and negative fixtures exist;
- tests cover wrong/missing/multiple audience, issuer, expiry, scope, request binding, refresh drift, and passthrough;
- integration and independent verification procedures exist;
- no real secrets are embedded;
- all README references resolve to generated files.

A deployment-specific DoD additionally requires successful execution of the verification criteria in `verification/verification.md`.

## Customization
- Replace sample domains and scopes in policy/fixtures.
- Add provider adapters for Entra, Auth0, Okta, custom OAuth servers, or other IdPs without weakening the resulting audience invariant.
- Add application roles alongside scopes where client-credentials flows are used.
- Add framework-specific integration tests for ASP.NET Core, Spring Security, Express/Passport, FastAPI, or gateway middleware.
- Add RFC 9728 metadata probes and real staging token acquisition if your CI has an isolated test IdP.
- Extend negative fixtures for multiple MCP resources, tenant boundaries, or service-to-service clients.
