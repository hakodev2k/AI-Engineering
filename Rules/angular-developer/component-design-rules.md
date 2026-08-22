# Component Design Rules

## Purpose
Ensure Angular components have clear responsibilities, stable contracts, and predictable rendering behavior.

## Scope
Standalone and module-declared components, inputs, outputs, templates, host bindings, and composition.

## MUST
- Give each component a coherent UI responsibility and explicit public contract.
- Treat required inputs, emitted events, and externally observable behavior as compatibility-sensitive contracts.
- Keep domain orchestration out of purely presentational components unless the component explicitly owns that workflow.
- Preserve deterministic rendering from current inputs and owned state.

## MUST NOT
- Mutate input-owned objects as an implicit communication channel.
- Expose internal implementation details through outputs or public members without a consumer requirement.
- Create large components that combine unrelated workflows merely to reduce file count.

## SHOULD
- Prefer composition and focused child components when separation improves ownership, testing, or rendering isolation.

## Exceptions
A deliberately integrated page component may coordinate multiple concerns when its orchestration responsibility is explicit and tested.

## Verification
Review component API surface, template complexity, mutation paths, tests, and dependency usage.