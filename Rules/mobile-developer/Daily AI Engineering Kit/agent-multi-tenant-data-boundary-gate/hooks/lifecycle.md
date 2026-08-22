# Lifecycle Hooks

## Pre-task boundary validation

**Trigger:** Before repository edits for a tenant-scoped task.

**Preconditions:** Task scope and affected module are known.

**Action:** Confirm tenant context source, tenant-owned entities, and affected read/write paths are identified.

**Command/script:** No mutation command; use repository inspection plus `skills/tenant-boundary-review.md`.

**Expected result:** Tenant context and ownership model are explicit.

**Failure behavior:** Missing ownership semantics blocks edits.

**Blocking:** Yes.

## Post-edit deterministic boundary gate

**Trigger:** After tenant-related code edits.

**Preconditions:** An operation manifest exists for each changed tenant-scoped path.

**Action:** Run `python scripts/tenant_boundary_gate.py <manifest> --output boundary-result.json`.

**Expected result:** Exit code 0 and `status=pass`.

**Failure behavior:** Preserve result; do not retry without remediation.

**Blocking:** Yes.

## Post-edit tests

**Trigger:** After gate passes.

**Preconditions:** Targeted tests exist.

**Action:** Run same-tenant positive and cross-tenant negative tests, then relevant build/integration checks.

**Expected result:** Tests pass without skipped boundary assertions.

**Failure behavior:** Maximum 2 evidence-driven fix/test cycles.

**Blocking:** Yes.

## Final package verification

**Trigger:** Before package completion.

**Preconditions:** Package files are present.

**Action:** Run `python scripts/verify_package.py`.

**Expected result:** Exit code 0.

**Failure behavior:** Missing/empty/incomplete package files block completion.

**Blocking:** Yes.
