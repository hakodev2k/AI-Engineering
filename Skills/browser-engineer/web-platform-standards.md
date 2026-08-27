# Web Platform Standards

## Purpose
Implement and review browser behavior against interoperable web standards without introducing vendor-specific semantics.

## When to use
Use for new Web APIs, DOM/CSS behavior, compatibility bugs, standards changes, or conformance failures.

## Inputs
Specification text, issue discussions, web-platform tests, interoperability evidence, implementation code.

## Context to inspect
Normative algorithms, definitions, IDL, integration points with other specifications, existing tests, compatibility constraints.

## Core knowledge
Specifications often define algorithms across multiple documents. Observable behavior includes exceptions, timing, ordering, serialization, security checks, and edge cases—not only happy-path output.

## Procedure
1. Identify the normative specification and exact algorithm.
2. Follow referenced definitions and integration hooks.
3. Compare existing implementation behavior.
4. Search conformance tests and cross-browser evidence.
5. Enumerate observable states, errors, and timing.
6. Implement the algorithm using existing engine abstractions.
7. Add or update interoperable tests.
8. Run affected suites and investigate divergences rather than masking them.

## Decision points
Follow standards over local convenience unless compatibility constraints justify a documented deviation. Prefer interoperable tests over implementation-specific assertions for public behavior.

## Common failure patterns
Implementing prose but missing referenced algorithms; ignoring exception timing; copying another engine's bug; adding vendor-only behavior; under-testing edge cases.

## Verification
Relevant web-platform tests pass, regressions are absent, and behavior matches normative requirements across representative cases.

## Expected output
Standards-aligned implementation plus durable conformance coverage.

## Stop conditions
Stop when specification text is ambiguous enough to require standards discussion or when compatibility evidence conflicts materially with the current specification.