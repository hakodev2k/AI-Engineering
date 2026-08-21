# Tenant Boundary Review

## Purpose
Detect and prevent tenant-isolation defects in API, service, ORM, background-job, and repository code before they reach production.

## When to use
Use for features or fixes that read/write tenant-owned data, introduce new data access, modify authorization, add background processing, or investigate suspected cross-tenant leakage.

## Inputs
- Repository root and affected modules.
- Tenant identity model and trusted source.
- Data entities and tenant key.
- Changed files or proposed implementation.
- Relevant tests and database protections.

## Preconditions
- Tenant ownership rules are identifiable.
- Read-only inspection is available.
- Any cross-tenant behavior is explicitly documented.

## Allowed tools
Repository search/read, git diff, test/build commands, static analysis, local database/schema inspection, and `scripts/tenant_boundary_gate.py`.

## Constraints
Follow `rules/multi-tenant-safety.md`. Do not access production data or weaken authorization.

## Process
1. Locate tenant-context creation and all trust boundaries that can set it.
2. Trace the request/job from entry point to every tenant-scoped data access.
3. List affected entities and identify their tenant key or partition key.
4. Inspect reads for explicit tenant predicates or verified global filters.
5. Inspect writes for ownership checks before mutation.
6. Inspect cache keys, queue messages, file/blob paths, and external calls for tenant scoping where present.
7. Identify bypasses such as `IgnoreQueryFilters`, raw SQL without tenant predicates, unscoped `Find`, privileged service clients, or user-controlled tenant IDs.
8. Run the deterministic gate against a prepared operation manifest.
9. Add or execute same-tenant and cross-tenant negative tests.
10. Classify facts, hypotheses, decisions, and unresolved risks separately.
11. Block completion for unresolved critical/high findings.

## Expected output
A boundary result matching `schemas/boundary-result.schema.json`, plus code/test evidence for each high-risk path.

## Verification
- Tenant source is trusted.
- Every tenant-scoped read is constrained.
- Every tenant-scoped write validates ownership.
- Cross-tenant paths require approved exceptions.
- Negative tests demonstrate denial.

## Failure handling
For tool/build failures, preserve output and retry once if transient. For missing tenant semantics, stop with `review`; for boundary violations, stop with `block`.

## Stop conditions
Stop when a cross-tenant path is proven unsafe, required context cannot be resolved, or an approval-required exception is encountered.
