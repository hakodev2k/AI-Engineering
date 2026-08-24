# Parser and AST Rules

## Purpose
Keep syntax processing deterministic, recoverable, and structurally sound.

## Scope
Lexing, parsing, syntax trees, recovery, and source locations.

## MUST
- Parser output MUST preserve source spans required by diagnostics and tooling.
- AST invariants MUST be explicit and validated at phase boundaries.
- Error recovery MUST guarantee forward progress and bounded resource use.
- Grammar changes MUST include precedence, associativity, malformed-input, and ambiguity tests.

## MUST NOT
- MUST NOT let malformed input trigger crashes, unbounded recursion, or infinite recovery loops.
- MUST NOT overload one AST node with incompatible semantic meanings without an explicit discriminator.
- MUST NOT discard trivia or location data required by supported tooling contracts.

## SHOULD
- Parsing SHOULD remain independent from target-specific lowering.
- Recovery SHOULD minimize cascading diagnostics.

## Exceptions
Nonstandard grammar handling requires documented motivation, affected inputs, risk, and tests.

## Verification
Run parser fuzzing, golden AST tests, malformed corpus tests, stack-depth tests, and grammar conflict checks.