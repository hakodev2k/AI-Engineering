# Skill: OAuth Boundary Audit

## Purpose
Audit an MCP authorization path for audience/resource binding and inbound-to-outbound token reuse.

## Trigger
New remote MCP server, auth middleware change, new downstream integration, or security regression.

## Inputs
Canonical resource URI; issuer list; tool-to-scope map; representative decoded claims; downstream request metadata; credential provenance.

## Preconditions
Use synthetic/redacted tokens only. Identify protected tools and downstream origins.

## Allowed tools
Source search, config inspection, HTTP test client against non-production fixtures, `scripts/oauth_boundary_guard.py`.

## Constraints
Never print raw tokens. Never weaken audience/scope checks to restore availability.

## Procedure
1. Record the canonical MCP resource and accepted issuers.
2. Enumerate protected tools and required scopes.
3. Trace authentication before any tool side effect.
4. Test correct audience, wrong audience, missing audience, expired token, and missing scope.
5. Trace each downstream HTTP client and credential source.
6. Compare redacted fingerprints of inbound and outbound bearer values.
7. Verify upstream credential failure fails closed.
8. Record evidence and remediation for every violation.

## Decision points
- Wrong audience or missing required scope: deny.
- Identical inbound/outbound bearer for a different resource: deny as passthrough.
- Unknown outbound provenance: deny until classified.

## Expected output
A pass/fail report with reason codes and no secrets.

## Metrics
Boundary-case coverage; violations found; protected actions executed after failed auth (target 0).

## Verification
Independent reviewer re-runs fixtures after remediation.

## Failure handling
At most two remediation/retest cycles, then escalate with evidence.

## Stop conditions
Stop immediately on raw-token leakage, bypass of protected-tool auth, or confirmed passthrough to a different resource.
