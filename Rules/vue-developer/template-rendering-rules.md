# Template and Rendering Rules

## Purpose
Keep Vue rendering correct, stable, accessible, and efficient.

## Scope
Templates, directives, lists, conditional rendering, dynamic components, and render functions.

## MUST
- Repeated stateful elements MUST use stable keys derived from durable identity.
- Conditional rendering choices (`v-if`, `v-show`, dynamic mounting) MUST account for lifecycle and cost when behavior is significant.
- Template expressions MUST remain deterministic and free of externally visible side effects.
- Dynamic HTML MUST be treated as untrusted unless sanitized by an approved strategy.
- Rendered states MUST account for loading, empty, error, disabled, and permission conditions where applicable.

## MUST NOT
- Array indexes MUST NOT be used as keys when insertion, removal, sorting, or state preservation can occur.
- `v-html` MUST NOT render untrusted or insufficiently sanitized content.
- Expensive computation MUST NOT be repeated in templates when it can be derived once with appropriate reactivity.

## SHOULD
- Prefer declarative templates over manual DOM manipulation.
- Use render functions only when they materially improve a dynamic abstraction.

## Exceptions
Index keys are acceptable only for immutable, append-free static lists whose items have no local state or identity-sensitive behavior.

## Verification
Inspect keys, directives, dynamic HTML sources, rendering profiler traces, and tests covering state transitions.