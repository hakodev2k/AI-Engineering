# Skill: MCP Authorization Boundary Analysis

## Purpose
Verify that a protected MCP action is bound to the intended issuer, MCP resource/audience, active token state, least-privilege scopes, and a separate downstream authorization boundary.

## Trigger
Use when implementing/reviewing remote MCP authorization, after an auth-library upgrade, or after an audience/issuer/introspection vulnerability.

## Inputs
Expected MCP canonical resource URI, allowed issuers, protected operations/scopes, validated token metadata, downstream API identity, and current security tests.

## Preconditions
Cryptographic token validation or standards-compliant introspection happens upstream. This skill consumes only non-secret metadata and never validates raw bearer material itself.

## Required context
MCP server URI, OAuth authorization server, resource indicator configuration, protected tool map, and downstream API trust boundaries.

## Allowed tools
MCP/OAuth specifications, identity-provider metadata, deterministic `scripts/token_binding_guard.py`, security test fixtures, application logs that exclude credentials.

## Constraints
Raw access/refresh tokens MUST NOT enter analysis artifacts. Missing required claims/configuration are failures, not wildcards. Inbound MCP credentials cannot be reused as downstream API credentials.

## Procedure
1. Draw boundaries: client → MCP resource server → downstream APIs.
2. Record canonical MCP resource and allowed issuer(s).
3. Map each protected operation to minimum scopes.
4. Confirm client requests use the MCP resource indicator.
5. Confirm server validation requires intended audience/resource and issuer.
6. For opaque tokens, confirm missing required introspection fields fail closed.
7. Confirm downstream APIs use separately obtained credentials for their own audience.
8. Run the deterministic guard on valid and adversarial fixtures.
9. Independently review denied paths and logs for credential leakage.

## Decision points
Any absent required audience, issuer, active state, or scope denies the action. Any requested inbound-token passthrough denies the action. Unknown provider semantics block completion until verified.

## Expected output
Trust-boundary map, policy configuration, allow/deny fixture evidence, missing controls, and remediation decision.

## Metrics
Protected-action coverage, denied attack fixtures, raw-secret leakage count, fail-closed missing-claim coverage, scope-minimization coverage.

## Verification
A verifier other than the implementer confirms wrong-audience, wrong-issuer, missing-active, missing-scope, passthrough, and raw-secret fixtures are denied.

## Failure handling
Do not relax validation to restore compatibility. Isolate the integration, gather provider metadata, and require explicit approval for any temporary compensating control.

## Stop conditions
Stop on ambiguous resource identity, unavailable issuer metadata, failed security fixture, detected secret logging, or two failed remediation attempts without new evidence.
