# Access Control

## Purpose
Constrain privileged blockchain operations to explicitly authorized principals.

## Scope
Admin functions, ownership, roles, multisig controls, governance executors, and operator permissions.

## MUST
- Define each privileged capability and its authorized principal explicitly.
- Enforce authorization at the state-changing boundary, not only in clients or off-chain services.
- Test unauthorized callers for every privileged operation.
- Separate routine operations from emergency or governance authority where risk differs.
- Document privilege transfer, revocation, and recovery behavior.

## MUST NOT
- Rely on obscurity, UI restrictions, or transaction origin as authorization.
- Introduce unrestricted admin paths or default-open roles.
- Change high-risk production privileges without explicit human approval.

## SHOULD
- Use least privilege, multisig controls, and timelocks proportional to impact.
- Keep privileged surface area small and enumerable.

## Exceptions
Broader authority requires documented operational need, bounded duration, compensating controls, and approval.

## Verification
Inspect modifiers/guards, role mappings, deployment configuration, negative tests, ownership state, and production permission evidence.