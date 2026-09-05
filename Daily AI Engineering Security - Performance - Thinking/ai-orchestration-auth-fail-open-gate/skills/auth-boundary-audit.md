# Skill: Auth Boundary Audit

## Purpose
Prove whether every AI orchestration/control endpoint enforces authentication on its actual reachable request path.

## Trigger
New agent dashboard; route or proxy change; authentication-library upgrade; public/internal exposure change; security advisory; pre-production review.

## Inputs
Route inventory, listener/bind configuration, proxy topology, middleware registration, critical capability list, negative-auth test results.

## Preconditions
Read-only access to effective configuration and a non-destructive test identity/path. Production testing requires authorization.

## Required context
Actual deployed route and network path, not only source-level intent.

## Allowed tools
Configuration/source inspection, route tables, reverse-proxy configuration, safe HTTP client, deployment metadata, `scripts/auth_surface_gate.py`.

## Constraints
Do not use real secrets in fixtures. Do not invoke destructive agent tools. Do not treat network location as authentication.

## Procedure
1. Inventory every reachable HTTP/WebSocket/control surface.
2. Mark critical surfaces: agent execution, tool execution, credential access/refresh, admin, data mutation, model configuration, repository/cloud actions.
3. Trace each surface from client to backend and record direct reachability.
4. Identify auth middleware and failure behavior. Verify startup/auth errors fail closed.
5. Inspect route exemptions and classify exact vs prefix matching.
6. Populate the gate JSON and run the checker for the baseline.
7. For every critical endpoint, send a safe request without credentials and expect 401/403 or transport-level denial.
8. Inspect whether a direct backend path bypasses a protected proxy.
9. Record Facts, Evidence, Assumptions, Risks, and Verification status.
10. Hand results to the independent Security Verifier.

## Decision points
- Critical + no/optional auth: block.
- Critical + upstream auth + direct backend reachable: block.
- Critical + prefix whitelist: block until explicitly proven safe and narrowed.
- Unknown auth mode/reachability: block.
- Negative-auth request succeeds: block and escalate.

## Expected output
Surface matrix, baseline findings, root cause, remediation target, negative-test evidence, reviewer handoff.

## Metrics
100% critical surfaces inventoried; 100% critical surfaces negative-tested; zero anonymous critical paths; zero direct proxy bypasses.

## Verification
Gate exit 0 plus negative tests and independent review.

## Failure handling
Retry evidence collection once for transient discovery failures. Unknown security state is not a pass.

## Stop conditions
Stop and escalate immediately if anonymous access reaches a critical capability, or after one unresolved evidence retry.