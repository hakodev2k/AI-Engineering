# Language Semantics Rules

## Purpose
Preserve source-language meaning across parsing, analysis, optimization, and code generation.

## Scope
Language specifications, semantic analysis, lowering, and compatibility decisions.

## MUST
- Observable compiler behavior MUST trace to a documented language rule or explicit extension.
- Semantic changes MUST include positive, negative, boundary, and compatibility tests.
- Diagnostics for invalid programs MUST identify the relevant construct without changing valid-program semantics.
- Ambiguous specification cases MUST be documented and escalated before behavior becomes a de facto contract.

## MUST NOT
- MUST NOT infer semantics from optimizer convenience.
- MUST NOT silently accept invalid constructs when acceptance changes portability or safety.
- MUST NOT change evaluation order, overflow, aliasing, or exception behavior contrary to the language contract.

## SHOULD
- Semantic rules SHOULD be centralized so front-end phases do not encode conflicting interpretations.
- Extensions SHOULD have explicit feature gates and compatibility policy.

## Exceptions
Any deliberate deviation requires rationale, compatibility impact, tests, risk assessment, and owner approval.

## Verification
Use conformance suites, differential tests, specification review, regression tests, and generated-program testing.