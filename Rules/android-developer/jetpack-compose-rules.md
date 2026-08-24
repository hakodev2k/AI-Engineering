# Jetpack Compose Rules

## Purpose
Keep Compose UI predictable, performant, testable, and accessible.

## Scope
Applies where Jetpack Compose is used.

## MUST
- Keep composables free of uncontrolled side effects; side effects MUST use lifecycle-aware effect APIs with correct keys.
- Hoist state when another owner requires control, persistence, or reuse.
- Provide stable identity for dynamic collections when item identity affects state or animation.
- Preserve semantic information required for accessibility and automated UI verification.
- Measure recomposition or rendering problems before claiming optimization.

## MUST NOT
- Start network calls, database writes, analytics mutations, or other non-idempotent work directly from composition.
- Store authoritative business state only in ephemeral composition memory.
- Apply memoization blindly as a substitute for profiling or correct state modeling.

## SHOULD
- Keep composables focused on rendering and event emission.
- Prefer immutable UI models and stable inputs where practical.
- Preview/test representative states including loading, empty, error, large-content, and accessibility cases.

## Exceptions
Framework interop may require controlled imperative code; isolate it and document ownership and cleanup.

## Verification
Use Compose tests, accessibility checks, layout inspection, profiling/recomposition diagnostics, and review of effect keys and state ownership.