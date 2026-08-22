# Skill — Token Boundary Review

## Purpose
Verify that an MCP server treats inbound client tokens and outbound upstream credentials as separate trust domains.

## Trigger
New MCP server, auth change, upstream API integration, or security review.

## Inputs
Expected issuer, expected MCP resource/audience, required scopes, token metadata, outbound credential source, tool-to-upstream mapping.

## Preconditions
Never provide raw production secrets. Use decoded claims, fingerprints, or test tokens.

## Allowed tools
Repository read, config inspection, JWT claim inspection without secret disclosure, deterministic scripts, test runner.

## Constraints
MUST NOT weaken audience validation to make integration pass. MUST NOT log bearer tokens. MUST require human approval before changing production identity configuration.

## Procedure
1. Identify trust boundaries: client → MCP server → upstream API.
2. Record expected issuer and exact resource/audience for the MCP server.
3. Verify signature, expiry/not-before, issuer, audience/resource, and required scopes.
4. Trace outbound Authorization construction.
5. Confirm outbound credentials are separately issued for the upstream API.
6. Search for forwarding/copying of inbound `Authorization` headers or bearer values.
7. Run valid, wrong-audience, missing-resource, expired, and passthrough fixtures.
8. Produce an allow/deny matrix with evidence.

## Decision points
- Wrong audience/resource → deny.
- Missing required scope → deny.
- Inbound token reused upstream → deny deployment.
- Unknown token provenance → escalate for identity review.

## Expected output
Trust-boundary diagram, validation matrix, blocked paths, residual risks, verification status.

## Metrics
Negative-fixture block rate, valid-fixture pass rate, number of passthrough paths, unresolved identity assumptions.

## Verification
An independent reviewer reruns the negative fixtures and checks outbound credential provenance.

## Failure handling
Capture reason, claim metadata without token value, affected tool, and configuration source. Do not retry auth failures automatically.

## Stop conditions
Stop when all negative fixtures are blocked, valid fixtures pass, no passthrough path remains, or a human decision is required for identity architecture.
