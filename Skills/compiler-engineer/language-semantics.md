# Language Semantics

## Purpose
Define and reason about the precise meaning of language constructs so compiler behavior is correct, stable, and testable across implementations.

## When to use
Use when adding syntax with semantic consequences, changing evaluation order, defining scoping or conversions, resolving ambiguous specification text, or investigating behavior that differs across backends.

## Inputs
Language specification, examples, compatibility requirements, parser/AST definitions, runtime behavior, and existing conformance tests.

## Preconditions
Identify the language version, compatibility policy, and whether behavior is specified, implementation-defined, unspecified, or erroneous.

## Context to inspect
Grammar, AST nodes, type rules, evaluation order, side effects, exceptions, constant evaluation, standard library contracts, and historical behavior.

## Core knowledge
Semantics must distinguish syntax from meaning. Senior compiler work requires explicit rules for binding, typing, conversions, sequencing, control flow, effects, and observable behavior. Compatibility constraints may be stronger than theoretical elegance.

## Procedure
1. State the semantic question precisely.
2. Find the authoritative specification or existing de facto behavior.
3. Identify observable states and effects.
4. Define evaluation order and error behavior.
5. Specify typing, conversions, and overload/binding rules.
6. Enumerate edge cases involving nullability, overflow, exceptions, generics, and side effects when relevant.
7. Map the rule to compiler phases responsible for enforcing it.
8. Add positive, negative, and boundary conformance cases.
9. Compare behavior across optimization levels and targets.
10. Document compatibility impact.

## Decision points
Preserve legacy behavior when compatibility is contractual; prefer specification correction only with explicit migration policy. Reject optimization transformations that change observable semantics.

## Common failure patterns
Implicit evaluation-order assumptions, conflating parser acceptance with semantic validity, inconsistent constant/runtime behavior, backend-specific drift, and undocumented implementation-defined behavior.

## Verification
Run conformance tests, differential tests across backends or compiler versions, and optimized/unoptimized comparisons. Confirm diagnostics match the intended semantic category.

## Expected output
A precise semantic rule, implementation mapping, compatibility notes, and regression tests.

## Stop conditions
Escalate when specification authorities conflict, compatibility requirements are unresolved, or the proposed rule changes observable behavior without approval.