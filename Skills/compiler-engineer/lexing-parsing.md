# Lexing and Parsing

## Purpose
Build and evolve a parser that accepts valid programs, rejects invalid syntax predictably, and preserves enough structure for diagnostics and tooling.

## When to use
Use when adding grammar features, resolving ambiguities, improving recovery, or investigating parse regressions.

## Inputs
Grammar/specification, token model, parser implementation, failing examples, diagnostics expectations.

## Context to inspect
Lexer modes, precedence rules, grammar conflicts, syntax tree shape, trivia handling, recovery strategy, parser tests and fuzzers.

## Core knowledge
Lexing and parsing must distinguish lexical ambiguity, syntactic ambiguity, and contextual syntax. Error recovery is part of the parser contract. CST/AST choices affect formatting and IDE tooling.

## Procedure
1. Reduce the requirement to grammar productions and lexical rules.
2. Check ambiguity and precedence interactions.
3. Inspect existing syntax-tree conventions.
4. Implement the smallest grammar change preserving compatibility.
5. Preserve spans, trivia, and recovery nodes as required.
6. Add valid, invalid, boundary, nesting, and ambiguity tests.
7. Exercise recovery after malformed constructs.
8. Measure parser performance on large and adversarial inputs.

## Decision points
Use generated parsers when grammar tooling and formal conflict analysis matter; hand-written recursive descent when control, diagnostics, and contextual parsing dominate. Avoid backtracking unless bounded and measured.

## Common failure patterns
Accidental precedence changes, quadratic parsing, token-mode leaks, poor synchronization after errors, accepting malformed syntax, AST shapes inconsistent with downstream assumptions.

## Verification
Run parser suites, negative tests, round-trip/tooling tests where applicable, fuzzing, and large-file benchmarks.

## Expected output
A grammar/parser change with explicit compatibility impact, robust recovery, and regression coverage.

## Stop conditions
Stop when the language specification is ambiguous or the requested syntax conflicts with compatibility guarantees.