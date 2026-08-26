# Production-Grade Code Samples

## Purpose
Create samples that are easy to learn from yet technically honest about production concerns.

## When to use
Use for SDK examples, launch demos, workshops, integration guides, and reference applications.

## Inputs
Supported SDK/API versions, target task, runtime constraints, auth model, expected deployment context.

## Context to inspect
Official docs, API contracts, existing conventions, dependency support windows, security guidance, error semantics, and CI configuration.

## Core knowledge
A sample is executable documentation. It must minimize incidental complexity without teaching unsafe defaults. Distinguish intentionally simplified demo code from production recommendations.

## Procedure
1. Define one primary learning objective.
2. Pin or constrain supported dependencies appropriately.
3. Use secure configuration and environment-based secrets.
4. Implement the happy path with idiomatic APIs.
5. Add validation, timeout, cancellation, and error handling proportional to the scenario.
6. Explain omitted production concerns explicitly.
7. Add setup, run, test, and cleanup instructions.
8. Add automated build/test checks.
9. Test from a clean environment.
10. Verify links and version compatibility.

## Decision points
Use minimal snippets for isolated concepts; runnable repositories for multi-step integrations. Add abstractions only when they clarify a reusable boundary.

## Common failure patterns
Hard-coded secrets, unbounded retries, obsolete APIs, hidden prerequisites, excessive framework scaffolding, non-idempotent setup, and samples that compile but fail at runtime.

## Verification
Reproduce from clean checkout, run tests, scan for secrets, exercise expected failures, and compare behavior to current canonical documentation.

## Expected output
A runnable, maintainable sample with explicit scope, prerequisites, verification steps, and production caveats.

## Stop conditions
Stop when required API behavior is undocumented, credentials cannot be handled safely, dependencies are unsupported, or sample claims cannot be reproduced.