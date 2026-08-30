# Skill: Tenant Boundary Audit

## Purpose
Prove that agent memory/checkpoint reads cannot cross the current tenant boundary across all configured persistence backends.

## Trigger
Run when adding/changing a persistence backend, upgrading LangGraph persistence packages, exposing search/list APIs, or before production release.

## Inputs
- production persistence backend inventory;
- package versions;
- tenant identity model;
- memory/search/list call sites;
- representative and adversarial tenant fixtures;
- application authorization adapter.

## Preconditions
A non-production test environment with at least two isolated tenants and disposable data is available.

## Required context
Know which values are trusted server-side identities versus user/agent-controlled filters or namespace labels.

## Allowed tools
Static code search, dependency inspection, test database clients, unit/integration tests, `scripts/tenant_boundary_check.py`, read-only logs.

## Constraints
MUST NOT use real customer secrets or production records. MUST NOT mutate production. MUST preserve authorization even if a backend upgrade changes matching behavior.

## Procedure
1. Inventory every `search`, `list`, namespace listing, checkpoint listing, and custom query adapter.
2. Record the canonical tenant ID source for each call.
3. Mark every user/agent-controlled input that can influence filters or namespaces.
4. Capture a baseline with tenant A and tenant B objects whose identifiers exercise prefix collisions (`alice`/`alice2`), wildcard-like labels (`_`, `%` where applicable), and backend query-operator structures.
5. Attempt each scoped read from tenant A and record all returned object tenant IDs.
6. Run `tenant_boundary_check.py` on captured records.
7. If a violation occurs, classify it as dependency vulnerability, application filter construction, namespace ambiguity, or post-retrieval authorization omission.
8. Form one remediation hypothesis at a time: upgrade package; enforce allowlisted filter grammar; switch to segment-aware namespace representation; add canonical post-retrieval ownership checks.
9. Re-run the same corpus after the change.
10. Hand evidence to the independent verifier.

## Decision points
- If vulnerable package versions are present, upgrade before deeper optimization.
- If user-controlled filters contain operator keys, reject them unless a narrowly allowlisted operator is explicitly required and separately authorized.
- If a backend cannot express exact segment semantics, perform exact canonical tenant verification after retrieval and consider replacing the backend adapter.

## Expected output
A machine-readable report with backend coverage, attempted attack cases, returned tenant IDs, violations, remediation status, and verification evidence.

## Metrics
Zero cross-tenant objects; zero forbidden operators accepted; 100% production backend coverage; 100% adversarial corpus pass rate.

## Verification
The verifier reruns tests independently and checks package versions plus the actual authorization path used in production configuration.

## Failure handling
Environmental failure: retry up to 2 times. Authorization violation: do not retry as transient; preserve evidence and block release.

## Stop conditions
Stop successfully only after every production backend passes. Stop unsuccessfully after two environmental retries or immediately on an unresolved cross-tenant read.
