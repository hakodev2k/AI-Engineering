# Semantic Analysis

## Purpose
Implement name resolution, scope rules, semantic validation, and symbol modeling while preserving precise diagnostics.

## When to use
Use for language features involving declarations, scopes, overloads, visibility, imports, or semantic constraints.

## Inputs
Language semantics, syntax trees, symbol tables, representative programs, compatibility requirements.

## Context to inspect
Scope construction, symbol identity, lookup order, overload resolution, module/import model, error symbols, source spans.

## Core knowledge
Semantic analysis converts syntax into meaning. Symbol identity, scope lifetime, shadowing, forward references, cycles, and error recovery must be explicit. Diagnostics should avoid cascades after a primary error.

## Procedure
1. Translate specification rules into semantic invariants.
2. Identify affected scopes and symbol kinds.
3. Separate declaration discovery from validation when cycles or forward references require it.
4. Define lookup and shadowing behavior.
5. Handle erroneous or incomplete syntax with stable error symbols.
6. Preserve source locations.
7. Add positive, negative, ambiguity, visibility, and cycle tests.
8. Check downstream IR assumptions.

## Decision points
Choose single-pass analysis for simple ordered languages; staged/bound analysis for forward references and richer tooling. Cache semantic results only with clear invalidation rules.

## Common failure patterns
Symbol identity based on spelling alone, cascading diagnostics, inconsistent shadowing, hidden order dependence, unresolved cycles, semantic caches surviving edits incorrectly.

## Verification
Run conformance tests, malformed-program tests, incremental-edit tests where applicable, and downstream lowering tests.

## Expected output
Deterministic semantic behavior with documented invariants and actionable diagnostics.

## Stop conditions
Escalate unresolved specification contradictions or changes that alter public name-resolution semantics.