# Code Review and Maintainability

## Purpose
Review game code for correctness, performance, lifecycle safety, architectural fit, content impact, and long-term maintainability rather than style alone.

## When to use
Use for gameplay pull requests, engine integrations, performance changes, networking, persistence, tools, and refactors.

## Inputs
Change diff, requirements, repository conventions, tests, profiler evidence when relevant, architecture context, and target-platform constraints.

## Context to inspect
Inspect call frequency, object lifecycle, ownership, engine thread rules, allocations, serialization, network authority, content compatibility, error handling, and tests.

## Core knowledge
Game code has unusual lifecycle and hot-path risks. A harmless-looking allocation or lookup may execute thousands of times per frame. Serialized fields and content identifiers can be compatibility contracts. Review risk, not just syntax.

## Procedure
1. Understand player/business intent and scope.
2. Trace changed state ownership and lifecycle.
3. Check correctness and edge cases.
4. Identify hot paths and require evidence for performance-sensitive changes.
5. Review serialization/save/network compatibility.
6. Check failure, cancellation, reset, and cleanup paths.
7. Evaluate coupling and whether abstractions clarify or obscure dependencies.
8. Verify tests/validation match risk.
9. Distinguish blocking defects from optional improvements.
10. Request measurements or prototypes when claims are uncertain.

## Decision points
Block changes for correctness, security, data loss, severe performance, or compatibility risks. Prefer follow-up work for low-risk cleanup that would unnecessarily delay delivery.

## Common failure patterns
Style-only reviews, missing lifecycle cleanup, hidden per-frame work, breaking serialized content, speculative abstractions, comments without rationale, and demanding refactors unrelated to the change.

## Verification
Run relevant tests/builds, inspect profiler evidence where claimed, validate representative content, and confirm review concerns are resolved rather than merely discussed.

## Expected output
Actionable review findings prioritized by risk with clear evidence and acceptance criteria.

## Stop conditions
Stop when requirements or runtime context are insufficient to judge a material risk; request evidence rather than guessing.