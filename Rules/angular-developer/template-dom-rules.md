# Template and DOM Rules

## Purpose
Keep Angular templates declarative, secure, maintainable, and compatible with framework rendering.

## Scope
Template bindings, control flow, directives, pipes, DOM access, refs, and dynamic rendering.

## MUST
- Keep templates focused on presentation and lightweight declarative transformation.
- Use framework rendering/binding APIs for DOM changes unless a platform integration requires direct access.
- Make repeated template logic reusable when duplication creates inconsistent behavior.
- Ensure custom directives have a narrow, documented behavioral contract.

## MUST NOT
- Put complex business orchestration in template expressions.
- Perform unsafe raw DOM writes with untrusted content.
- Depend on DOM structure owned by another component as an undocumented contract.
- Use impure transformations on hot rendering paths without measured justification.

## SHOULD
- Prefer pure pipes/computed derivation for stable presentation transformations when reuse or memoization is beneficial.

## Exceptions
Direct DOM access is acceptable for browser/library interoperability when encapsulated, platform-safe, security-reviewed, and tested.

## Verification
Review templates, lint/static checks, hostile-content tests, SSR compatibility where relevant, and rendering profiles for hot paths.