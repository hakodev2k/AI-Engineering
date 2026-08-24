# Skill: MCP OAuth Scope Diagnosis

## Purpose
Diagnose scope regressions across MCP OAuth discovery, authorization, refresh, and step-up without exposing or manipulating credentials.

## Trigger
Use when an MCP integration loses refreshability, unexpectedly requests interactive reauthorization, receives `insufficient_scope`, or produces a requested scope set different from operator configuration.

## Inputs
- Explicit required and desired scopes.
- Authorization Server `scopes_supported` when available.
- Previously granted scopes.
- Runtime challenge scopes.
- Whether non-interactive refresh survivability is required.
- Sanitized client/SDK logs showing requested scopes.

## Preconditions
Do not collect access tokens, refresh tokens, authorization codes, client secrets, cookies, or browser session data. Redact them if they appear in logs.

## Required context
Know which data is operator intent versus server metadata versus previously granted state. Treat those as different provenance classes.

## Allowed tools
Static file inspection, sanitized log analysis, OAuth metadata retrieval, `scripts/mcp_scope_guard.py`, unit tests, and protocol documentation.

## Constraints
- MUST NOT weaken required scope policy merely to make authorization succeed.
- MUST NOT assume a refresh token will be issued even when `offline_access` is requested.
- MUST preserve prior grants during step-up unless the operator explicitly requires a narrower reauthorization.
- MUST separate advertised support from required client intent.

## Procedure
1. Capture the baseline: configured scopes, actual authorization-request scopes, granted scopes, expiry behavior, and failure point.
2. Label every scope with provenance: `required`, `desired`, `granted`, or `challenge`.
3. Run the deterministic analyzer using only non-secret scope metadata.
4. Compare effective scopes with the actual client request. Any missing required scope is a blocking regression.
5. If refresh survivability is required, verify `offline_access` is retained when the authorization server advertises it; record that issuance still depends on server policy.
6. For 403 step-up, verify the next authorization request is a union of current grants and required challenge scopes.
7. Form one hypothesis for the first mutation point where intent is lost. Prefer observed request logs or unit-level instrumentation over inference.
8. Apply the smallest implementation fix at that mutation point.
9. Re-run the baseline and regression tests.

## Decision points
- Required scope unsupported: block and escalate configuration/server incompatibility.
- Required scope supported but omitted from request: client/SDK merge bug.
- Scope present in request but absent from grant: authorization-server policy or user-consent outcome; do not misclassify as client merge failure.
- Refresh token exists but step-up dead-ends: test refresh-token branch separately from initial authorization.

## Expected output
A scope provenance table, first-loss location, reproducible failing case, proposed fix, before/after requested scopes, and verification status.

## Metrics
Required-scope loss count, scope provenance completeness, step-up union correctness, unexpected-interactive-reauth count.

## Verification
A fix is verified only if the same sanitized input that failed now preserves required scopes, the unit suite passes, and a representative refresh/step-up scenario behaves as intended.

## Failure handling
Retry diagnosis at most twice after gathering new evidence. If the mutation point remains unknown, stop and request runtime instrumentation rather than changing auth policy blindly.

## Stop conditions
Stop on unsupported required scope, missing authoritative configuration, credential exposure risk, or after two evidence-backed diagnostic iterations without isolating the mutation point.
