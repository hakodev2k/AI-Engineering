# Tenant Boundary Workflow

## Trigger
Any change or investigation involving tenant-owned data, tenant resolution, authorization, persistence, cache/queue/storage scoping, or suspected cross-tenant access.

## Entry conditions
- Task scope is known.
- Repository is readable.
- Tenant ownership model can be discovered or is documented.

## Inputs
Task request, changed files, tenant model, repository context, tests, and `config/policy.yaml`.

## Context
Use only the modules required to trace affected entry points through persistence/external boundaries. Expand context when evidence requires it.

## Stages

### 1. Explore — Boundary Explorer
Map trusted tenant sources, tenant-owned resources, access paths, protections, and bypasses.

Checkpoint: every affected path reaches a data/external boundary or is marked unresolved.

### 2. Plan — Boundary Planner
Choose enforcement points, required edits, test matrix, gate manifests, and approval boundaries.

Checkpoint: every high-risk path has a verification method.

### 3. Execute — Boundary Implementer
Apply the smallest safe change. Add regression tests. Do not alter public contracts unless required.

Checkpoint: no unapproved cross-tenant behavior or security weakening is introduced.

### 4. Deterministic gate — Boundary Implementer
Run:
`python scripts/tenant_boundary_gate.py <operation-manifest.json> --output boundary-result.json`

Checkpoint: exit code 0 for intended tenant-scoped operations. Exit code 1 blocks completion.

### 5. Test
Run targeted same-tenant success tests and cross-tenant denial tests, followed by relevant build/integration checks.

### 6. Verify — Boundary Verifier
Independently inspect the diff, gate results, tenant sources, read predicates/global filters, write ownership validation, and negative tests.

### 7. Complete
Report evidence, remaining risks, and any approved exceptions.

## Produced artifacts
- Boundary Explorer evidence.
- Implementation plan.
- Code/test changes in the target repository.
- Operation manifest(s).
- Boundary gate result(s).
- Independent verification result.

## Retry rules
- Transient tool/CI failure: maximum 1 retry; preserve original output.
- Test failure after implementation: maximum 2 fix-test cycles, each addressing a specific evidenced cause.
- Deterministic boundary block: no blind retry; remediate the finding or escalate.
- Permission/environment failure: do not elevate privileges; stop and report evidence.

## Approval points
Human approval is required before intentional cross-tenant access, disabling tenant filters/RLS, production data repair, schema changes, destructive data actions, or security-control weakening.

## Failure paths
- Unknown tenant ownership → status `review`; stop mutation work.
- Missing/untrusted tenant context → `block`.
- Unscoped read or ownership-unverified write → `block`.
- Cross-tenant operation without approved exception → `block`.
- Repeated build/test failure after retry budget → stop with preserved evidence.

## Stop conditions
Stop immediately on critical boundary violation, approval-required operation, missing required context that cannot be derived, or exhausted retry budget.

## Definition of Done
- Trusted tenant context is resolved.
- All affected reads are tenant-scoped or protected by verified equivalent enforcement.
- All affected writes verify tenant ownership.
- Same-tenant positive and cross-tenant negative tests pass.
- Deterministic gate passes for intended operations.
- Independent verification passes.
- No unapproved cross-tenant exception or bypass remains.
- Remaining risks are documented.
