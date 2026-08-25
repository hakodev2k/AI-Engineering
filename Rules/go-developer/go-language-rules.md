# Go Language Rules

## Purpose
Define Senior-level use of Go language semantics for maintainable production systems.

## Scope
Applies to Go source, packages, exported APIs, control flow, values, pointers, and interfaces.

## MUST
- Code MUST preserve zero-value and nil semantics intentionally and document surprising cases.
- Exported APIs MUST expose the smallest stable surface needed by callers.
- Pointer versus value semantics MUST be chosen from mutation, identity, copying cost, and method-set requirements.
- Type assertions and conversions MUST handle failure where runtime uncertainty exists.
- Errors MUST retain enough context to diagnose the failed operation.

## MUST NOT
- MUST NOT use panic for ordinary recoverable control flow.
- MUST NOT introduce interfaces solely to imitate class hierarchies.
- MUST NOT rely on unspecified map iteration order.
- MUST NOT hide ownership or mutation behind ambiguous APIs.

## SHOULD
- Prefer simple concrete types until substitution is required by a real boundary.
- Prefer standard-library conventions and idioms over custom abstractions.

## Exceptions
Exceptions require a documented constraint, alternatives considered, risk, and verification evidence.

## Verification
Use `go test`, `go vet`, static analysis, API review, and targeted tests for nil, zero-value, conversion, and error paths.