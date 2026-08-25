# Code Quality

## Purpose
Keep Rust code maintainable under long-term change without sacrificing correctness for cleverness.

## Scope
Implementation structure, refactoring, abstractions, macros, generics, duplication, and reviewability.

## MUST
- Complex abstractions MUST justify the failure modes or duplication they remove.
- Refactors affecting behavior MUST retain regression evidence.
- Compiler and Clippy warnings configured as quality gates MUST be resolved or explicitly justified.
- Public and safety-critical code MUST remain understandable to maintainers without relying on undocumented invariants.

## MUST NOT
- MUST NOT use macros, advanced generics, or type tricks solely to reduce line count at the expense of diagnosability.
- MUST NOT suppress lints globally when a narrow justified suppression is sufficient.
- MUST NOT mix unrelated behavioral changes into risk-sensitive refactors without review rationale.

## SHOULD
- Prefer explicit, idiomatic Rust and cohesive modules.
- Keep abstractions at the level of stable repetition rather than anticipated reuse.

## Exceptions
Intentional complexity requires documented benefit, alternatives, and maintenance implications.

## Verification
Run formatting, compiler, Clippy, tests, complexity-oriented review, and inspect lint suppressions and macro expansion where relevant.