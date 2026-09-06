# API Versioning and Compatibility

## Purpose
Evolve APIs without unexpectedly breaking consumers.

## When to use
Use before contract changes, deprecations, migrations, or compatibility-policy design.

## Inputs
Current and proposed contracts, consumer inventory, usage telemetry, release constraints.

## Context to inspect
Inspect deployed versions, generated clients, consumer coupling, schema history, and deprecation practices.

## Core knowledge
Compatibility is primarily behavioral, not merely syntactic. Additive changes can still break strict clients; semantic changes can break consumers while schemas remain valid.

## Procedure
1. Diff current and proposed contracts.
2. Classify each change as compatible, conditionally compatible, or breaking.
3. Identify affected consumers from telemetry and ownership data.
4. Prefer additive evolution when semantics remain clear.
5. Introduce explicit versions only when incompatible semantics cannot be safely evolved.
6. Define coexistence and migration windows.
7. Publish deprecation metadata and migration guidance.
8. Add automated compatibility checks to CI.
9. Observe old-version usage before retirement.
10. Remove only after exit criteria are satisfied.

## Decision points
Use path/header/media-type versions according to ecosystem conventions. Avoid version proliferation when additive evolution is sufficient.

## Common failure patterns
Assuming optional fields are harmless, changing enum behavior, reusing fields with new semantics, removing undocumented behavior consumers rely on, and retiring versions without telemetry.

## Verification
Run schema and behavioral compatibility tests; verify consumer migration and zero meaningful traffic before retirement.

## Expected output
A controlled evolution plan with compatibility evidence and retirement criteria.

## Stop conditions
Stop if consumer ownership or production usage cannot be established for a potentially breaking change.