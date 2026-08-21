# Multi-Tenant Safety Rules

## MUST

- Resolve exactly one tenant context before tenant-scoped data access.
- Prove the tenant identifier came from a trusted source defined in `config/policy.yaml`.
- Include the tenant key in every tenant-scoped read predicate unless the ORM applies an equivalent verified global filter.
- Verify every create/update/delete target belongs to the resolved tenant before mutation.
- Treat missing, conflicting, or malformed tenant context as blocking.
- Preserve evidence for the resolved tenant, query scope, write target, and verification result.
- Require an explicit approved exception for intentional cross-tenant operations.
- Run targeted tests covering same-tenant success and cross-tenant denial before completion.

## MUST NOT

- Do not infer tenant identity from an arbitrary request body field supplied by the caller.
- Do not disable global query filters or row-level protections to unblock implementation.
- Do not perform cross-tenant reads or writes because an actor is merely authenticated.
- Do not accept an untrusted header as tenant authority unless gateway attestation is verified.
- Do not use admin/system credentials as a substitute for tenant authorization.
- Do not log secrets or full sensitive payloads as evidence.
- Do not approve production data repair, bulk cross-tenant mutation, security weakening, or schema changes without explicit human approval.

## SHOULD

- Prefer centralized tenant context resolution and repository/data-access enforcement over repeated controller checks.
- Prefer database row-level security, partition keys, or enforced global filters as defense in depth where supported.
- Keep cross-tenant administration in separate code paths with stronger authorization and audit requirements.
- Add regression tests whenever a boundary defect is found.
