# Defaults and Precedence

## Purpose
Make effective configuration predictable when defaults, files, environment variables, flags, and remote sources interact.

## Scope
Default values, override layers, inheritance, merging, and resolution order.

## MUST
- Precedence order MUST be deterministic, documented, and testable.
- Safety-critical defaults MUST fail safe rather than silently broaden access or impact.
- Effective configuration MUST distinguish explicit values from inherited defaults where operationally relevant.
- Merge semantics for lists, maps, and nested structures MUST be defined rather than assumed.
- Default changes MUST undergo impact analysis as behavior changes.

## MUST NOT
- Two sources MUST NOT have ambiguous precedence for the same setting.
- Empty, null, missing, and zero values MUST NOT be treated as interchangeable unless the contract defines them as equivalent.
- A lower-priority source MUST NOT unexpectedly override a higher-priority policy boundary.

## SHOULD
- Keep override depth shallow.
- Provide tooling to render effective configuration before activation.

## Exceptions
Complex inheritance may be justified for platform-scale reuse, but requires explicit merge semantics, diagnostics, and tests demonstrating resolution behavior.

## Verification
Run resolution tests covering all source combinations, boundary values, null/missing cases, and nested merges. Compare rendered effective configuration against documented precedence and expected policy constraints.