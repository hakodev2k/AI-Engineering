# Skill: MCP Cache Trust Assessment

## Purpose
Determine whether an MCP cache can safely reuse a result without crossing user, tenant, credential, permission, or instruction-trust boundaries.

## Trigger
New shared MCP gateway; protocol upgrade; introduction of response caching; third-party server onboarding; authorization model change; cache poisoning report.

## Inputs
Cache records/configuration, cache-key dimensions, authentication and tenancy model, MCP result type, TTL, server identity, instruction-handling path.

## Preconditions
Read-only access to configuration and test environment. Do not use production secrets as fixtures.

## Required context
Effective cache key and response admission logic, not only application-level intended policy.

## Allowed tools
Configuration inspection, code search, safe synthetic MCP responses, cache logs with redacted identifiers, this package's checker.

## Constraints
No raw secrets in logs or fixtures. No weakening of auth for testing. Treat remote metadata as untrusted.

## Procedure
1. Inventory cacheable MCP result classes and their effective scopes/TTLs.
2. Identify whether each result varies by server, tenant, principal, credential, permission set, locale, or runtime configuration.
3. Trace whether natural-language server instructions enter model context and at what trust level.
4. Compare required variation dimensions against actual cache keys.
5. Run `scripts/check_cache_policy.py` on the modeled records.
6. Create two-principal negative fixtures: seed cache as principal A and request as principal B; verify no sensitive result crosses.
7. Create a poisoned-instructions fixture and verify it is not admitted to a public/shared cache or trusted system-instruction channel.
8. Record findings as Facts, Evidence, Risks, Decision, Verification status.
9. Hand off to an independent Security Verifier.

## Decision points
- Unknown sensitivity -> bypass shared cache and block public admission.
- Instruction-bearing + public -> block by default.
- Auth/tenant/user/permission sensitive + public -> block.
- Private sensitive result missing partition fields -> block.

## Expected output
Cache trust matrix, violations, remediation plan, before/after test evidence.

## Metrics
Blocking entries, partition completeness, cross-boundary leaks, poisoned instruction admissions, cache bypass rate, approved exceptions.

## Verification
Checker passes and negative cross-principal tests prove isolation.

## Failure handling
One retry for transient cache introspection errors. Unknown effective keying remains blocking.

## Stop conditions
Stop and escalate on confirmed cross-user leakage, secret exposure, or any remediation that requires weakening authorization.