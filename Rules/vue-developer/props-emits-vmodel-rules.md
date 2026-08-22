# Props, Emits, and v-model Rules

## Purpose
Maintain predictable parent-child contracts and one-way data ownership.

## Scope
Props, emits, defineModel/v-model contracts, event payloads, and component APIs.

## MUST
- Required versus optional props MUST reflect actual runtime requirements.
- Event names and payloads MUST represent stable semantic events rather than leaking internal implementation details.
- Two-way binding contracts MUST clearly define ownership, accepted values, and update timing.
- Complex prop defaults MUST avoid shared mutable instances.
- Public component contracts MUST be type-checked and regression-tested when used across features.

## MUST NOT
- Child components MUST NOT mutate prop-owned objects as a hidden substitute for emitting an update.
- Events MUST NOT expose DOM implementation details when consumers only need a domain-level outcome.
- v-model MUST NOT create circular synchronization between multiple authorities.

## SHOULD
- Prefer semantic events such as `submitted` or `selectionChanged` over events named after internal methods.
- Keep public component APIs minimal and backward-compatible when shared broadly.

## Exceptions
Intentional shared mutable objects require explicit ownership documentation and tests proving consumers agree on mutation semantics.

## Verification
Review prop writes, emitted payload types, v-model flows, public API usage, and component contract tests.