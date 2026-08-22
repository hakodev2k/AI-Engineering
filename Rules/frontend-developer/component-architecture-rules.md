# Component Architecture Rules
## Purpose
Keep UI components cohesive, reusable, and independently evolvable.
## Scope
Components, composition, ownership, and public component contracts.
## MUST
- Components MUST have a clear responsibility and explicit public contract.
- Shared components MUST separate reusable behavior from product-specific policy.
- State ownership MUST remain at the narrowest level that satisfies coordination needs.
- Breaking component-contract changes MUST identify affected consumers before merge.
## MUST NOT
- Components MUST NOT depend on hidden global state when dependencies can be explicit.
- Presentation components MUST NOT accumulate unrelated orchestration merely for convenience.
## SHOULD
- Prefer composition over deeply configurable monolithic components.
## Exceptions
Intentional coupling requires documented scope, trade-off, and migration impact.
## Verification
Review dependency direction, prop/event contracts, state ownership, consumer impact, and architecture tests where available.